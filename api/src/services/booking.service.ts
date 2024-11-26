import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'

import db from '~/config/database'
import { TABLES } from '~/constants'
import { IBooking } from '~/interfaces'
import accountService from './account.service'
import billerService from './biller.service'
import companyService from './company.service'
import currencyService from './currency.service'
// import taxRateService from './taxRate.service'
import projectService from './project.service'

class BookingService {
  async createBooking(req: Request, res: Response): Promise<Response<IBooking>> {
    const formattedBooking = await this.formatBooking(req.body)
    if (!formattedBooking) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Required fields are missing' })
    }

    const isDuplicate = await this.isDuplicateBooking(formattedBooking)
    if (isDuplicate) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Booking already exists with the provided details' })
    }

    const [createdBooking] = await db(TABLES.BOOKING).insert(formattedBooking).returning('*')
    return res.status(StatusCodes.CREATED).json(createdBooking)
  }

  async getAllBookings(req: Request, res: Response): Promise<Response<IBooking[]>> {
    const { page, page_size, ...filters } = req.query

    let query = db(TABLES.BOOKING)
      .innerJoin(TABLES.ACCOUNT, 'bookings.account_id', 'accounts.account_id')
      .innerJoin(TABLES.COMPANY, 'bookings.company_id', 'companies.company_id')
      .leftJoin(TABLES.BILLER, 'bookings.invoice_issuer_id', 'billers.biller_id')
      .leftJoin(TABLES.CURRENCY, 'bookings.currency', 'currencies.currency_code')
      .leftJoin(TABLES.TAX_RATE, 'bookings.tax_rate_id', 'tax_rates.tax_rate_id')
      .select(
        'bookings.*',
        'bookings.booking_id as id',
        'accounts.account_name ',
        'companies.company_name',
        'billers.name as biller_name',
        'currencies.currency_code as currency_code',
        'tax_rates.rate as tax_rate'
      )

    query = this.applyFilters(query, filters)

    const pageNumber = parseInt(page as string, 10) || 1
    const pageSize = parseInt(page_size as string, 10) || 10
    query = this.applyPagination(query, pageNumber, pageSize)

    const bookings = await query
    const total = await this.getTotalCount(filters)

    return res.json({
      data: bookings,
      meta: {
        page: pageNumber,
        page_size: pageSize,
        total
      }
    })
  }

  async getBookingById(req: Request, res: Response): Promise<Response<IBooking>> {
    const { booking_id } = req.params
    const booking = await db(TABLES.BOOKING)
      .innerJoin(TABLES.ACCOUNT, 'accounts.account_id', 'bookings.account_id')
      .leftJoin(TABLES.BILLER, 'bookings.biller_id', 'billers.biller_id')
      .leftJoin(TABLES.CURRENCY, 'bookings.currency_id', 'currencies.currency_id')
      .leftJoin(TABLES.TAX_RATE, 'bookings.tax_rate_id', 'tax_rates.tax_rate_id')
      .where('bookings.booking_id', booking_id)
      .select(
        'bookings.*',
        'accounts.name as account_name',
        'billers.name as biller_name',
        'currencies.currency_code as currency_code',
        'tax_rates.rate as tax_rate'
      )
      .first()

    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Booking not found' })
    }

    const documents = await db(TABLES.DOCUMENT).where({ booking_id }).select()
    return res.json({ ...booking, documents })
  }

  async findBookingById(booking_id: number) {
    return await db(TABLES.BOOKING).where('bookings.booking_id', booking_id).first()
  }

  async updateBooking(req: Request, res: Response): Promise<Response<IBooking>> {
    const { booking_id } = req.params
    const formattedBooking = await this.formatBooking(req.body)

    if (!booking_id || !formattedBooking) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking ID and update data are required' })
    }

    const updatedBooking = await db(TABLES.BOOKING).where({ booking_id }).update(formattedBooking).returning('*')
    if (updatedBooking.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Booking not found' })
    }

    return res.json(updatedBooking[0])
  }

  async deleteBooking(req: Request, res: Response): Promise<Response> {
    const { booking_id } = req.params

    if (!booking_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking ID is required' })
    }

    const deletedBooking = await db(TABLES.BOOKING).where({ booking_id }).del()
    if (deletedBooking === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Booking not found' })
    }

    return res.status(StatusCodes.NO_CONTENT).send()
  }

  async addDocumentToBooking(req: Request, res: Response): Promise<Response> {
    const { booking_id } = req.params
    const { file_url, metadata } = req.body

    if (!booking_id || !file_url) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking ID and file URL are required' })
    }

    const [document] = await db(TABLES.DOCUMENT)
      .insert({
        booking_id,
        file_url,
        metadata: JSON.stringify(metadata),
        uploaded_at: new Date()
      })
      .returning('*')

    return res.status(StatusCodes.CREATED).json(document)
  }

  async getDocumentsByBookingId(req: Request, res: Response): Promise<Response> {
    const { booking_id } = req.params
    const documents = await db(TABLES.DOCUMENT).where({ booking_id }).select()

    if (documents.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Documents not found' })
    }

    return res.json(documents)
  }

  private async isDuplicateBooking(booking: IBooking) {
    const existingBooking = await db(TABLES.BOOKING)
      .where({
        company_id: booking.company_id,
        account_id: booking.account_id,
        invoice_issuer_id: booking.invoice_issuer_id,
        total_amount: booking.total_amount
      })
      .first()
    return existingBooking !== undefined
  }

  private async formatBooking(data: any) {
    const {
      company_id,
      account_id,
      biller_id,
      tax_rate_id,
      entry_date,
      invoice_date,
      invoice_received_date,
      total_amount,
      tax_amount,
      tax_rate,
      expense_category,
      tags,
      currency,
      due_date,
      payment_status,
      reference_number,
      project_cost_center,
      notes
    } = data

    if (
      !company_id ||
      !account_id ||
      !biller_id ||
      !tax_rate_id ||
      !entry_date ||
      !invoice_date ||
      !total_amount ||
      !tax_amount ||
      !tax_rate ||
      !expense_category ||
      !currency ||
      !due_date ||
      !payment_status ||
      !reference_number
    ) {
      throw new Error('Missing required fields')
    }

    const companyFound = await companyService.findCompanyById(company_id)
    if (!companyFound) {
      throw new Error(`Company with id ${company_id} not found`)
    }

    const accountFound = await accountService.findAccountById(account_id)
    if (!accountFound) {
      throw new Error(`Account with id ${account_id} not found`)
    }

    const billerFound = await billerService.findBillerById(biller_id)
    if (!billerFound) {
      throw new Error(`Biller with id ${biller_id} not found`)
    }

    // const taxRateFound = await taxRateService.findTaxRateById(tax_rate_id)
    // if (!taxRateFound) {
    //   throw new Error(`Tax rate with id ${tax_rate_id} not found`)
    // }

    // const currencyFound = await currencyService.findCurrencyById(currency)
    // if (!currencyFound) {
    //   throw new Error(`Currency with id ${currency} not found`)
    // }

    return {
      company_id,
      account_id,
      biller_id,
      tax_rate_id,
      entry_date: moment(entry_date).format('YYYY-MM-DD'),
      invoice_date: moment(invoice_date).format('YYYY-MM-DD'),
      invoice_received_date: invoice_received_date ? moment(invoice_received_date).format('YYYY-MM-DD') : null,
      total_amount,
      tax_amount,
      tax_rate,
      expense_category,
      tags,
      currency,
      due_date: moment(due_date).format('YYYY-MM-DD'),
      payment_status,
      reference_number,
      project_cost_center,
      notes
    }
  }

  private applyFilters(query: any, filters: any) {
    const { company_id, biller_id, account_id, start_date, end_date } = filters

    if (company_id) {
      query.where('bookings.company_id', company_id)
    }

    if (biller_id) {
      query.where('bookings.biller_id', biller_id)
    }

    if (account_id) {
      query.where('bookings.account_id', account_id)
    }

    if (start_date) {
      query.where('bookings.entry_date', '>=', start_date)
    }

    if (end_date) {
      query.where('bookings.entry_date', '<=', end_date)
    }

    return query
  }

  private applyPagination(query: any, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize
    return query.limit(pageSize).offset(offset)
  }

  private async getTotalCount(filters: any) {
    let query = db(TABLES.BOOKING)
    query = this.applyFilters(query, filters)
    const result = await query.count('* as count').first()
    return result?.count || 0
  }
}

export default new BookingService()
