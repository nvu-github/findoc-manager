import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'

import db from '~/config/database'
import { TABLES } from '~/constants'
import { ICurrency } from '~/interfaces'

class CurrencyService {
  async createCurrencyFromJob(currency: ICurrency): Promise<void> {
    const { currency_code, last_updated, exchange_rate } = currency

    await db(TABLES.CURRENCY)
      .insert({
        currency_code,
        last_updated: moment(last_updated).format('YYYY-MM-DD'),
        exchange_rate
      })
      .onConflict(['last_updated', 'currency_code'])
      .merge()
  }

  async getAllCurrencies(req: Request, res: Response): Promise<Response<ICurrency>> {
    const currencies = await db(TABLES.CURRENCY).select('*', 'currencies.currency_code as id')
    return res.json(currencies)
  }


  async findCurrencyByCode(currencyCode: string): Promise<ICurrency> {
    return await db(TABLES.CURRENCY).where('currencies.currency_code', currencyCode).first()
  }
}

export default new CurrencyService()
