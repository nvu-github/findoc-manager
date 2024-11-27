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
import S3Service from './s3.service'

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
    const { page = 1, page_size = 10, ...filters } = req.query

    let query = db(TABLES.BOOKING)
      .innerJoin(TABLES.ACCOUNT, 'bookings.account_id', 'accounts.account_id')
      .innerJoin(TABLES.COMPANY, 'bookings.invoice_recipient_id', 'companies.company_id')
      .leftJoin(TABLES.BILLER, 'bookings.invoice_issuer_id', 'billers.biller_id')
      .leftJoin(TABLES.CURRENCY, 'bookings.currency', 'currencies.currency_code')
      .leftJoin(TABLES.TAX_RATE, 'bookings.tax_rate_id', 'tax_rates.tax_rate_id')
      .select(
        'bookings.booking_id as id',
        'accounts.account_name',
        'companies.company_name',
        'billers.name as biller_name',
        'currencies.currency_code as currency_code',
        'tax_rates.rate as tax_rate',
        'bookings.*'
      )
      .orderBy('bookings.booking_id', 'asc')

    query = this.applyFilters(query, filters)
    query = this.applyPagination(query, parseInt(page as string, 10), parseInt(page_size as string, 10))

    const [bookings, countResult] = await Promise.all([query, db(TABLES.BOOKING).count('* as count').first()])
    const count = countResult?.count || 0

    return res.json({
      data: bookings,
      meta: {
        page: parseInt(page as string, 10),
        page_size: parseInt(page_size as string, 10),
        total: count
      }
    })
  }

  async getBookingById(req: Request, res: Response): Promise<Response<IBooking>> {
    const { booking_id } = req.params
    const booking = await db(TABLES.BOOKING)
      .innerJoin(TABLES.ACCOUNT, 'accounts.account_id', 'bookings.account_id')
      .leftJoin(TABLES.BILLER, 'bookings.invoice_issuer_id', 'billers.biller_id')
      .leftJoin(TABLES.CURRENCY, 'bookings.currency', 'currencies.currency_code')
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

  async findBookingById(booking_id: number): Promise<IBooking> {
    return await db(TABLES.BOOKING).where({ booking_id }).first()
  }

  async updateBooking(req: Request, res: Response): Promise<Response<IBooking>> {
    const { booking_id } = req.params
    const formattedBooking = await this.formatBooking(req.body)

    if (!booking_id || !formattedBooking) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking ID and update data are required' })
    }

    const updatedBooking = await db(TABLES.BOOKING).where({ booking_id }).update(formattedBooking).returning('*')
    if (!updatedBooking) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Booking not found' })
    }

    return res.json(updatedBooking)
  }

  async deleteBooking(req: Request, res: Response): Promise<Response> {
    const { booking_id } = req.params

    if (!booking_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking ID is required' })
    }

    const trx = await db.transaction()

    try {
      const documents = await trx(TABLES.DOCUMENT).where({ booking_id })

      if (documents.length > 0) {
        for (const document of documents) {
          const folderPrefix = `documents/${booking_id}/${document.file_url}`
          await S3Service.deleteFolder(folderPrefix)
        }
        await trx(TABLES.DOCUMENT).where({ booking_id }).del()
      }

      const deletedBooking = await trx(TABLES.BOOKING).where({ booking_id }).del()

      if (!deletedBooking) {
        await trx.commit()
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Booking not found' })
      }

      await trx.commit()

      return res.status(StatusCodes.NO_CONTENT).send()
    } catch (error) {
      await trx.rollback()
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' })
    }
  }

  private async isDuplicateBooking(booking: IBooking) {
    const existingBooking = await db(TABLES.BOOKING)
      .where({
        account_id: booking.account_id,
        invoice_issuer_id: booking.invoice_issuer_id,
        invoice_recipient_id: booking.invoice_recipient_id,
        total_amount: booking.total_amount
      })
      .first()
    return !!existingBooking
  }

  private async formatBooking(data: any) {
    const {
      account_id,
      invoice_recipient_id,
      invoice_issuer_id,
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
      !account_id ||
      !invoice_issuer_id ||
      !invoice_recipient_id ||
      !entry_date ||
      !invoice_date ||
      !total_amount ||
      !tax_rate ||
      !currency ||
      !payment_status ||
      !reference_number ||
      !expense_category
    ) {
      throw new Error('Missing required fields')
    }

    const [companyFound, accountFound, billerFound, currencyFound] = await Promise.all([
      companyService.findCompanyById(invoice_recipient_id),
      accountService.findAccountById(account_id),
      billerService.findBillerById(invoice_issuer_id),
      currencyService.findCurrencyByCode(currency)
    ])

    if (!companyFound || !accountFound || !billerFound || !currencyFound) {
      throw new Error('One or more required entities not found')
    }

    return {
      account_id,
      invoice_issuer_id,
      invoice_recipient_id,
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
    const { invoice_recipient_id, invoice_issuer_id, account_id, start_date, end_date } = filters

    if (invoice_recipient_id) query.where('bookings.invoice_recipient_id', invoice_recipient_id)
    if (invoice_issuer_id) query.where('bookings.invoice_issuer_id', invoice_issuer_id)
    if (account_id) query.where('bookings.account_id', account_id)
    if (start_date) query.where('bookings.entry_date', '>=', start_date)
    if (end_date) query.where('bookings.entry_date', '<=', end_date)

    return query
  }

  private applyPagination(query: any, page: number, pageSize: number) {
    return query.limit(pageSize).offset((page - 1) * pageSize)
  }
}

export default new BookingService()
