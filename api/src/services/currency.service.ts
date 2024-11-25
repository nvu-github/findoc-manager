import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'

import db from '~/config/database'
import { TABLES } from '~/constants'
import { ICurrency } from '~/interfaces'

class CurrencyService {
  async createCurrency(req: Request, res: Response): Promise<Response<ICurrency>> {
    const { currency_code, last_updated, exchange_rate } = req.body

    if (!currency_code || !last_updated || !exchange_rate) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Required fields are missing' })
    }

    const [currency] = await db(TABLES.CURRENCY)
      .insert({
        currency_code,
        last_updated: moment(last_updated).format('YYYY-MM-DD'),
        exchange_rate
      })
      .returning('*')

    return res.status(StatusCodes.CREATED).json(currency)
  }

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

  async getCurrencyById(req: Request, res: Response): Promise<Response<ICurrency>> {
    const { currency_id } = req.params

    const currency = await db(TABLES.CURRENCY).where({ currency_id }).first()

    if (!currency) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Currency not found' })
    }

    return res.json(currency)
  }

  async findCurrencyById(currency_id: number) {
    return await db(TABLES.CURRENCY).where('currencies.currency_id', currency_id).first()
  }

  async updateCurrency(req: Request, res: Response): Promise<Response<ICurrency>> {
    const { currency_id } = req.params
    const { currency_code, last_updated, exchange_rate } = req.body

    if (!currency_id || (!currency_code && !last_updated && !exchange_rate)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Currency ID and at least one field to update are required' })
    }

    const updateData: any = {}
    if (currency_code) updateData.currency_code = currency_code
    if (last_updated) updateData.last_updated = moment(last_updated).format('YYYY-MM-DD')
    if (exchange_rate) updateData.exchange_rate = exchange_rate

    const updated = await db(TABLES.CURRENCY).where({ currency_id }).update(updateData).returning('*')

    if (updated.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Currency not found' })
    }

    return res.json(updated[0])
  }

  async deleteCurrency(req: Request, res: Response): Promise<Response<ICurrency>> {
    const { currency_id } = req.params

    if (!currency_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Currency ID is required' })
    }

    const deleted = await db(TABLES.CURRENCY).where({ currency_id }).del()

    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Currency not found' })
    }

    return res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default new CurrencyService()
