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
