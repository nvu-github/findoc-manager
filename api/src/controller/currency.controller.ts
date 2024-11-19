import { Request, Response } from 'express'
import currencyService from '~/services/currency.service'
import { StatusCodes } from 'http-status-codes'

class CurrencyController {
  async createCurrency(req: Request, res: Response): Promise<Response> {
    try {
      return await currencyService.createCurrency(req, res)
    } catch (error) {
      console.error('Error creating currency:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create currency' })
    }
  }

  async getAllCurrencies(req: Request, res: Response): Promise<Response> {
    try {
      return await currencyService.getAllCurrencies(req, res)
    } catch (error) {
      console.error('Error fetching currencies:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch currencies' })
    }
  }

  async getCurrencyById(req: Request, res: Response): Promise<Response> {
    try {
      return await currencyService.getCurrencyById(req, res)
    } catch (error) {
      console.error('Error fetching currency:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch currency' })
    }
  }

  async updateCurrency(req: Request, res: Response): Promise<Response> {
    try {
      return await currencyService.updateCurrency(req, res)
    } catch (error) {
      console.error('Error updating currency:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update currency' })
    }
  }

  async deleteCurrency(req: Request, res: Response): Promise<Response> {
    try {
      return await currencyService.deleteCurrency(req, res)
    } catch (error) {
      console.error('Error deleting currency:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete currency' })
    }
  }
}

export default new CurrencyController()
