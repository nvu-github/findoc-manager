import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { IBooking } from '~/interfaces'

class BookingService {
  async createBooking(req: Request, res: Response): Promise<Response<IBooking>> {
    const {
      company_id,
      account_id,
      biller_id,
      date,
      amount,
      currency,
      exchange_rate,
      description,
      tax_amount,
      tag,
      invoice_date,
      payment_date,
      tax_date
    } = req.body

    if (!company_id || !account_id || !biller_id || !date || !amount) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Required fields are missing' })
    }

    const [createdBooking] = await db(TABLES.BOOKING)
      .insert({
        company_id,
        account_id,
        biller_id,
        date,
        amount,
        currency,
        exchange_rate,
        description,
        tax_amount,
        tag,
        invoice_date,
        payment_date,
        tax_date
      })
      .returning('*')

    return res.status(StatusCodes.CREATED).json(createdBooking)
  }

  async getAllBookings(req: Request, res: Response): Promise<Response<IBooking[]>> {
    const bookings = await db(TABLES.BOOKING)
      .innerJoin(TABLES.ACCOUNT, 'accounts.account_id', 'bookings.account_id')
      .select()
    const fmtBookings = await this.formattedBookings(bookings)
    return res.json(fmtBookings)
  }

  async getBookingById(req: Request, res: Response): Promise<Response<IBooking>> {
    const { booking_id } = req.params
    const booking = await db(TABLES.BOOKING)
      .innerJoin(TABLES.ACCOUNT, 'accounts.account_id', 'bookings.account_id')
      .where('bookings.booking_id', booking_id)
      .first()
    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Booking not found' })
    }
    const documents = await db(TABLES.DOCUMENT).where({ booking_id }).select()
    return res.json({ ...booking, documents })
  }

  async updateBooking(req: Request, res: Response): Promise<Response<IBooking>> {
    const { booking_id } = req.params
    const updateData = req.body

    if (!booking_id || !updateData) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Booking ID and update data are required' })
    }

    const updatedBooking = await db(TABLES.BOOKING).where({ booking_id }).update(updateData).returning('*')
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

  private async formattedBookings(bookings: IBooking[]): Promise<IBooking[]> {
    const formattedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const documentBooking = await db(TABLES.DOCUMENT).where({ booking_id: booking.booking_id }).select()
        return {
          ...booking,
          documents: documentBooking
        }
      })
    )
    return formattedBookings
  }
}

export default new BookingService()
