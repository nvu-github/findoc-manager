import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Account } from '../../types'
import axios from '../../services/api'

interface AccountState {
  accounts: Account[]
  loading: boolean
  error: string | null
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null
}

export const addAccountAsync = createAsyncThunk(
  'account/addAccount',
  async (newAccount: Omit<Account, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/account', newAccount)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add account')
    }
  }
)

export const updateAccountAsync = createAsyncThunk(
  'account/updateAccount',
  async ({ accountId, updatedAccount }: { accountId: number; updatedAccount: Account }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/account/${accountId}`, updatedAccount)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update account')
    }
  }
)

export const deleteAccountAsync = createAsyncThunk(
  'account/deleteAccount',
  async (accountId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/account/${accountId}`)
      return accountId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account')
    }
  }
)

export const getAllAccountsAsync = createAsyncThunk('account/getAccounts', async (filter: any, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/account`, { params: filter })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch accounts')
  }
})

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAccountAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addAccountAsync.fulfilled, (state, action: PayloadAction<Account>) => {
        state.loading = false
        state.accounts.push(action.payload)
      })
      .addCase(addAccountAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateAccountAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateAccountAsync.fulfilled, (state, action: PayloadAction<Account>) => {
        state.loading = false
        const index = state.accounts.findIndex((a) => a.accountId === action.payload.accountId)
        if (index !== -1) {
          state.accounts[index] = action.payload
        }
      })
      .addCase(updateAccountAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteAccountAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAccountAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.accounts = state.accounts.filter((a) => Number(a.accountId) !== action.payload)
      })
      .addCase(deleteAccountAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAllAccountsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllAccountsAsync.fulfilled, (state, action: PayloadAction<Account[]>) => {
        state.loading = false
        state.accounts = action.payload
      })
      .addCase(getAllAccountsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default accountSlice.reducer
