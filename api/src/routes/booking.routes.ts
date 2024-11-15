import express from 'express'
import bookingController from '~/controller/booking.controller'

const router = express.Router()

router.get('/', bookingController.getAllBookings)
router.get('/:booking_id', bookingController.getBookingById)
router.post('/', bookingController.createBooking)
router.put('/:booking_id', bookingController.updateBooking)
router.delete('/:booking_id', bookingController.deleteBooking)

export default router
