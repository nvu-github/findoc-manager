import { configureStore } from '@reduxjs/toolkit'

import companySlice from './slices/company.slice'
import accountSlice from './slices/account.slice'
import billerSlice from './slices/biller.slice'
import bookingSlice from './slices/booking.slice'
import currencySlice from './slices/currency.slice'
import projectSice from './slices/project.slice'

export const store = configureStore({
  reducer: {
    company: companySlice,
    account: accountSlice,
    biller: billerSlice,
    booking: bookingSlice,
    currency: currencySlice,
    project: projectSice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
