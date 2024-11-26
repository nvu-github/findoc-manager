import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { ITaxRate } from '~/interfaces'

class TaxRateService {
  async createTaxRate(req: Request, res: Response): Promise<Response<ITaxRate>> {
    const taxRate: Omit<ITaxRate, 'tax_rate_id'> = req.body

    if (!taxRate || !taxRate.region || !taxRate.rate) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or missing tax rate data' })
    }

    const [createdTaxRate] = await db(TABLES.TAX_RATE).insert(taxRate).returning('*')
    return res.status(StatusCodes.CREATED).json(createdTaxRate)
  }

  async getAllTaxRates(req: Request, res: Response): Promise<Response<ITaxRate[]>> {
    const taxRates = await db(TABLES.TAX_RATE).select('*').orderBy('tax_rate_id', 'asc')

    return res.status(StatusCodes.OK).json(taxRates)
  }

  async getTaxRateById(req: Request, res: Response): Promise<Response<ITaxRate>> {
    const { tax_rate_id } = req.params

    const taxRate = await db(TABLES.TAX_RATE).where({ tax_rate_id }).first()

    if (!taxRate) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tax rate not found' })
    }

    return res.status(StatusCodes.OK).json(taxRate)
  }

  async findTaxRateById(tax_rate_id: number): Promise<ITaxRate | undefined> {
    return db(TABLES.TAX_RATE).where({ tax_rate_id }).first()
  }

  async updateTaxRate(req: Request, res: Response): Promise<Response<ITaxRate>> {
    const { tax_rate_id } = req.params
    const taxRate: Partial<ITaxRate> = req.body

    if (!tax_rate_id || !taxRate) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Tax rate ID and tax rate data are required' })
    }

    const updatedTaxRate = await db(TABLES.TAX_RATE).where({ tax_rate_id }).update(taxRate).returning('*')

    if (updatedTaxRate.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tax rate not found' })
    }

    return res.status(StatusCodes.OK).json(updatedTaxRate[0])
  }

  async deleteTaxRate(req: Request, res: Response): Promise<Response<void>> {
    const { tax_rate_id } = req.params

    if (!tax_rate_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Tax rate ID is required' })
    }

    const deletedTaxRate = await db(TABLES.TAX_RATE).where({ tax_rate_id }).del()

    if (deletedTaxRate === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tax rate not found' })
    }

    return res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default new TaxRateService()
