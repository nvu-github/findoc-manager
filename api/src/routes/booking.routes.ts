import express from 'express'
import bookingController from '~/controller/booking.controller'
import uploadDocumentsMiddleware from '~/middlewares/upload.middleware'

const router = express.Router()

router.get('/', bookingController.getAllBookings)
router.get('/:booking_id', bookingController.getBookingById)
router.post('/', bookingController.createBooking)
router.post('/:booking_id/documents', uploadDocumentsMiddleware, bookingController.createDocuments)
router.put('/:booking_id', bookingController.updateBooking)
router.delete('/:booking_id', bookingController.deleteBooking)

export default router
