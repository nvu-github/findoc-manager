import { Request, Response } from 'express'
import taxRateService from '~/services/taxrate.service'
import { StatusCodes } from 'http-status-codes'

class TaxRateController {
  async createTaxRate(req: Request, res: Response): Promise<Response> {
    try {
      return await taxRateService.createTaxRate(req, res)
    } catch (error) {
      console.error('Error creating tax rate:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create tax rate' })
    }
  }

  async getAllTaxRates(req: Request, res: Response): Promise<Response> {
    try {
      return await taxRateService.getAllTaxRates(req, res)
    } catch (error) {
      console.error('Error fetching tax rates:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch tax rates' })
    }
  }

  async getTaxRateById(req: Request, res: Response): Promise<Response> {
    try {
      return await taxRateService.getTaxRateById(req, res)
    } catch (error) {
      console.error('Error fetching tax rate:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch tax rate' })
    }
  }

  async updateTaxRate(req: Request, res: Response): Promise<Response> {
    try {
      return await taxRateService.updateTaxRate(req, res)
    } catch (error) {
      console.error('Error updating tax rate:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update tax rate' })
    }
  }

  async deleteTaxRate(req: Request, res: Response): Promise<Response> {
    try {
      return await taxRateService.deleteTaxRate(req, res)
    } catch (error) {
      console.error('Error deleting tax rate:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete tax rate' })
    }
  }
}

export default new TaxRateController()
