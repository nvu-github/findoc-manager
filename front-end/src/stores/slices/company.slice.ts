import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Company } from '../../types'
import axios from '../../services/api'

interface CompanyState {
  companies: Company[]
  loading: boolean
  error: string | null
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null
}

export const addCompanyAsync = createAsyncThunk(
  'company/addCompany',
  async (newCompany: Omit<Company, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/company', newCompany)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add company')
    }
  }
)

export const updateCompanyAsync = createAsyncThunk(
  'company/updateCompany',
  async ({ companyId, updatedCompany }: { companyId: number; updatedCompany: Company }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/company/${companyId}`, updatedCompany)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update company')
    }
  }
)

export const deleteCompanyAsync = createAsyncThunk(
  'company/deleteCompany',
  async (companyId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/company/${companyId}`)
      return companyId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete company')
    }
  }
)

export const getAllCompanyAsync = createAsyncThunk('company/getCompanies', async (filter: any, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/company`, { params: filter })
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete company')
  }
})

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCompanyAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addCompanyAsync.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false
        state.companies.push(action.payload)
      })
      .addCase(addCompanyAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateCompanyAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCompanyAsync.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false
        const index = state.companies.findIndex((c) => c.companyId === action.payload.companyId)
        if (index !== -1) {
          state.companies[index] = action.payload
        }
      })
      .addCase(updateCompanyAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteCompanyAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCompanyAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.companies = state.companies.filter((c) => c.companyId !== action.payload)
      })
      .addCase(deleteCompanyAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(getAllCompanyAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllCompanyAsync.fulfilled, (state, action: PayloadAction<Company[]>) => {
        state.loading = false
        state.companies = action.payload
      })
      .addCase(getAllCompanyAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default companySlice.reducer
