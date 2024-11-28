import cron from 'node-cron'
import axios from 'axios'
import moment from 'moment'
import currencyService from '~/services/currency.service'

const FIXER_API_URL = process.env.FIXER_API_URL
const FIXER_API_KEY = process.env.FIXER_API_KEY

const fetchAndSaveExchangeRates = async () => {
  try {
    const response = await axios.get(`${FIXER_API_URL}`, {
      params: {
        access_key: FIXER_API_KEY
      }
    })

    const rates = response.data.rates
    const date = response.data.date

    if (!rates || !date) {
      throw new Error('No exchange rate data found from API')
    }

    for (const [currencyCode, rate] of Object.entries(rates)) {
      const currency = {
        last_updated: moment(date).format('YYYY-MM-DD'),
        currency_code: currencyCode,
        exchange_rate: rate
      }
      await currencyService.createCurrencyFromJob(currency)
    }

    console.log(`[${new Date().toISOString()}] Exchange rates updated successfully!`)
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Failed to fetch exchange rates:`, error.message)
  }
}

cron.schedule('0 0 * * *', () => {
  console.log(`[${new Date().toISOString()}] Starting cron job to fetch exchange rates...`)
  fetchAndSaveExchangeRates()
})
