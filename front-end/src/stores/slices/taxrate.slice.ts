import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { TaxRate } from '../../types'
import axios from '../../services/api'

interface TaxRateState {
  taxRates: TaxRate[]
  loading: boolean
  error: string | null
}

const initialState: TaxRateState = {
  taxRates: [],
  loading: false,
  error: null
}

export const addTaxRateAsync = createAsyncThunk(
  'taxRate/addTaxRate',
  async (newTaxRate: Omit<TaxRate, 'taxRateId'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/tax-rate', newTaxRate)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add tax rate')
    }
  }
)

export const updateTaxRateAsync = createAsyncThunk(
  'taxRate/updateTaxRate',
  async ({ taxRateId, updatedTaxRate }: { taxRateId: number; updatedTaxRate: TaxRate }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/tax-rate/${taxRateId}`, updatedTaxRate)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tax rate')
    }
  }
)

export const deleteTaxRateAsync = createAsyncThunk(
  'taxRate/deleteTaxRate',
  async (taxRateId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/tax-rate/${taxRateId}`)
      return taxRateId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tax rate')
    }
  }
)

export const getAllTaxRatesAsync = createAsyncThunk('taxRate/getTaxRates', async (filter: any, { rejectWithValue }) => {
  try {
    const response = await axios.get('/tax-rate', { params: filter })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tax rates')
  }
})

const taxRateSlice = createSlice({
  name: 'taxRate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTaxRateAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addTaxRateAsync.fulfilled, (state, action: PayloadAction<TaxRate>) => {
        state.loading = false
        state.taxRates.push(action.payload)
      })
      .addCase(addTaxRateAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateTaxRateAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTaxRateAsync.fulfilled, (state, action: PayloadAction<TaxRate>) => {
        state.loading = false
        const index = state.taxRates.findIndex((t) => t.taxRateId === action.payload.taxRateId)
        if (index !== -1) {
          state.taxRates[index] = action.payload
        }
      })
      .addCase(updateTaxRateAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteTaxRateAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTaxRateAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.taxRates = state.taxRates.filter((t) => t.taxRateId !== action.payload)
      })
      .addCase(deleteTaxRateAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAllTaxRatesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllTaxRatesAsync.fulfilled, (state, action: PayloadAction<TaxRate[]>) => {
        state.loading = false
        state.taxRates = action.payload
      })
      .addCase(getAllTaxRatesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default taxRateSlice.reducer
