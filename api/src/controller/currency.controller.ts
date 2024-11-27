import { Request, Response } from 'express'
import currencyService from '~/services/currency.service'
import { StatusCodes } from 'http-status-codes'

class CurrencyController {
  async getAllCurrencies(req: Request, res: Response): Promise<Response> {
    try {
      return await currencyService.getAllCurrencies(req, res)
    } catch (error) {
      console.error('Error fetching currencies:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch currencies' })
    }
  }
}

export default new CurrencyController()
