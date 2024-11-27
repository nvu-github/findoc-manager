import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from '../../services/api'
import { Booking, Document } from '../../types'
import { formatParamsForAxios } from '../../utils'

interface BookingState {
  bookings: Booking[]
  documents: Document[]
  meta: any
  loading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  documents: [],
  meta: null,
  loading: false,
  error: null
}

export const addBookingAsync = createAsyncThunk(
  'booking/addBooking',
  async (newBooking: Omit<Booking, 'bookingId'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/booking', newBooking)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add booking')
    }
  }
)

export const updateBookingAsync = createAsyncThunk(
  'booking/updateBooking',
  async ({ bookingId, updatedBooking }: { bookingId: number | any; updatedBooking: Booking }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/booking/${bookingId}`, updatedBooking)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking')
    }
  }
)

export const deleteBookingAsync = createAsyncThunk(
  'booking/deleteBooking',
  async (bookingId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/booking/${bookingId}`)
      return bookingId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete booking')
    }
  }
)

export const addBookingDocuments = createAsyncThunk(
  'booking/addBookingDocuments',
  async ({ bookingId, formData }: { bookingId: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/booking/${bookingId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload documents')
    }
  }
)

export const getDocumentsByBookingId = createAsyncThunk(
  'booking/getDocumentsByBookingId',
  async (bookingId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/booking/${bookingId}/documents`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents')
    }
  }
)

export const deleteDocumentBooking = createAsyncThunk(
  'booking/deleteDocumentBooking',
  async ({ bookingId, documentId }: { bookingId: number; documentId: number }, { rejectWithValue }) => {
    try {
      await axios.delete(`/booking/${bookingId}/document`, { data: { documentId } })
      return documentId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document')
    }
  }
)

export const getAllBookingsAsync = createAsyncThunk('booking/getBookings', async (filter: any, { rejectWithValue }) => {
  try {
    const formattedFilter = filter ? formatParamsForAxios(filter) : null
    const response = await axios.get('/booking', { params: formattedFilter })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
  }
})

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBookingAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addBookingAsync.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false
        state.bookings.push(action.payload)
      })
      .addCase(addBookingAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(updateBookingAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBookingAsync.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false
        const index = state.bookings.findIndex((b) => b.bookingId === action.payload.bookingId)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
      .addCase(updateBookingAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteBookingAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBookingAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.bookings = state.bookings.filter((b) => b.bookingId !== action.payload)
      })
      .addCase(deleteBookingAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(addBookingDocuments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addBookingDocuments.fulfilled, (state, action: PayloadAction<Document[]>) => {
        state.loading = false
        state.documents = action.payload
      })
      .addCase(addBookingDocuments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(getDocumentsByBookingId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDocumentsByBookingId.fulfilled, (state, action: PayloadAction<Document[]>) => {
        state.loading = false
        state.documents = action.payload
      })
      .addCase(getDocumentsByBookingId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteDocumentBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDocumentBooking.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.documents = state.documents.filter((doc: Document) => Number(doc.documentId) !== action.payload)
      })
      .addCase(deleteDocumentBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(getAllBookingsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllBookingsAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.bookings = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(getAllBookingsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default bookingSlice.reducer
