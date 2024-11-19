import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from '../../services/api'
import { Currency } from '../../types'

interface CurrencyState {
  currencies: Currency[]
  loading: boolean
  error: string | null
}

const initialState: CurrencyState = {
  currencies: [],
  loading: false,
  error: null
}

export const addCurrencyAsync = createAsyncThunk(
  'currency/addCurrency',
  async (newCurrency: Omit<Currency, 'currencyId'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/currency', newCurrency)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add currency')
    }
  }
)

export const updateCurrencyAsync = createAsyncThunk(
  'currency/updateCurrency',
  async ({ currencyId, updatedCurrency }: { currencyId: number; updatedCurrency: Currency }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/currency/${currencyId}`, updatedCurrency)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update currency')
    }
  }
)

export const deleteCurrencyAsync = createAsyncThunk(
  'currency/deleteCurrency',
  async (currencyId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/currency/${currencyId}`)
      return currencyId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete currency')
    }
  }
)

export const getAllCurrenciesAsync = createAsyncThunk('currency/getCurrencies', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/currency')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch currencies')
  }
})

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCurrencyAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addCurrencyAsync.fulfilled, (state, action: PayloadAction<Currency>) => {
        state.loading = false
        state.currencies.push(action.payload)
      })
      .addCase(addCurrencyAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateCurrencyAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCurrencyAsync.fulfilled, (state, action: PayloadAction<Currency>) => {
        state.loading = false
        const index = state.currencies.findIndex((c) => c.currencyId === action.payload.currencyId)
        if (index !== -1) {
          state.currencies[index] = action.payload
        }
      })
      .addCase(updateCurrencyAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteCurrencyAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCurrencyAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.currencies = state.currencies.filter((c) => c.currencyId !== action.payload)
      })
      .addCase(deleteCurrencyAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAllCurrenciesAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllCurrenciesAsync.fulfilled, (state, action: PayloadAction<Currency[]>) => {
        state.loading = false
        state.currencies = action.payload
      })
      .addCase(getAllCurrenciesAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default currencySlice.reducer
