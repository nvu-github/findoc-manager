import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Biller } from '../../types'
import axios from '../../services/api'

interface BillerState {
  billers: Biller[]
  loading: boolean
  error: string | null
}

const initialState: BillerState = {
  billers: [],
  loading: false,
  error: null
}

export const addBillerAsync = createAsyncThunk(
  'biller/addBiller',
  async (newBiller: Omit<Biller, 'billerId'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/biller', newBiller)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add biller')
    }
  }
)

export const updateBillerAsync = createAsyncThunk(
  'biller/updateBiller',
  async ({ billerId, updatedBiller }: { billerId: number; updatedBiller: Biller }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/biller/${billerId}`, updatedBiller)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update biller')
    }
  }
)

export const deleteBillerAsync = createAsyncThunk(
  'biller/deleteBiller',
  async (billerId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/biller/${billerId}`)
      return billerId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete biller')
    }
  }
)

export const getAllBillersAsync = createAsyncThunk('biller/getBillers', async (filter: any, { rejectWithValue }) => {
  try {
    const response = await axios.get('/biller', { params: filter })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch billers')
  }
})

const billerSlice = createSlice({
  name: 'biller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBillerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addBillerAsync.fulfilled, (state, action: PayloadAction<Biller>) => {
        state.loading = false
        state.billers.push(action.payload)
      })
      .addCase(addBillerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateBillerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBillerAsync.fulfilled, (state, action: PayloadAction<Biller>) => {
        state.loading = false
        const index = state.billers.findIndex((b) => b.billerId === action.payload.billerId)
        if (index !== -1) {
          state.billers[index] = action.payload
        }
      })
      .addCase(updateBillerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(deleteBillerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBillerAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.billers = state.billers.filter((b) => b.billerId !== action.payload)
      })
      .addCase(deleteBillerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAllBillersAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllBillersAsync.fulfilled, (state, action: PayloadAction<Biller[]>) => {
        state.loading = false
        state.billers = action.payload
      })
      .addCase(getAllBillersAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default billerSlice.reducer
