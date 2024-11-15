import { Request, Response } from 'express'
import bookingService from '~/services/booking.service'
import { StatusCodes } from 'http-status-codes'

class BookingController {
  async createBooking(req: Request, res: Response): Promise<Response> {
    try {
      return await bookingService.createBooking(req, res)
    } catch (error) {
      console.error('Error creating booking:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create booking' })
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<Response> {
    try {
      return await bookingService.getAllBookings(req, res)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch bookings' })
    }
  }

  async getBookingById(req: Request, res: Response): Promise<Response> {
    try {
      return await bookingService.getBookingById(req, res)
    } catch (error) {
      console.error('Error fetching booking:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch booking' })
    }
  }

  async updateBooking(req: Request, res: Response): Promise<Response> {
    try {
      return await bookingService.updateBooking(req, res)
    } catch (error) {
      console.error('Error updating booking:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update booking' })
    }
  }

  async deleteBooking(req: Request, res: Response): Promise<Response> {
    try {
      return await bookingService.deleteBooking(req, res)
    } catch (error) {
      console.error('Error deleting booking:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete booking' })
    }
  }

  async addDocumentToBooking(req: Request, res: Response): Promise<Response> {
    try {
      return await bookingService.addDocumentToBooking(req, res)
    } catch (error) {
      console.error('Error adding document to booking:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to add document' })
    }
  }

  async getDocumentsByBookingId(req: Request, res: Response): Promise<Response> {
    try {
      return await bookingService.getDocumentsByBookingId(req, res)
    } catch (error) {
      console.error('Error fetching documents:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch documents' })
    }
  }
}

export default new BookingController()
