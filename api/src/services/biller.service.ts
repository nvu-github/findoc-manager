import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { IBiller } from '~/interfaces'

class BillerService {
  async createBiller(req: Request, res: Response): Promise<Response<IBiller>> {
    const { name, address, tax_id, default_currency, contact_info, biller_type } = req.body

    if (!name || !biller_type) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Biller name and biller type are required' })
    }

    const [createdBiller] = await db(TABLES.BILLER)
      .insert({ name, address, tax_id, default_currency, contact_info, biller_type })
      .returning('*')

    return res.status(StatusCodes.CREATED).json(createdBiller)
  }

  async getAllBillers(req: Request, res: Response): Promise<Response<IBiller[]>> {
    const billers = await db(TABLES.BILLER).select('*', 'billers.biller_id as id').orderBy('billers.biller_id', 'asc')
    return res.status(StatusCodes.OK).json(billers)
  }

  async getBillerById(req: Request, res: Response): Promise<Response<IBiller>> {
    const { biller_id } = req.params

    const biller = await db(TABLES.BILLER).where({ biller_id }).first()

    if (!biller) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Biller not found' })
    }

    return res.status(StatusCodes.OK).json(biller)
  }

  async findBillerById(biller_id: number): Promise<IBiller | undefined> {
    return db(TABLES.BILLER).where({ biller_id }).first()
  }

  async updateBiller(req: Request, res: Response): Promise<Response<IBiller>> {
    const { biller_id } = req.params
    const { name, address, tax_id, default_currency, contact_info, biller_type } = req.body

    if (!biller_id || !name || !biller_type) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Biller ID, name, and biller type are required' })
    }

    const updatedBiller = await db(TABLES.BILLER)
      .where({ biller_id })
      .update({ name, address, tax_id, default_currency, contact_info, biller_type })
      .returning('*')

    if (!updatedBiller) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Biller not found' })
    }

    return res.status(StatusCodes.OK).json(updatedBiller)
  }

  async deleteBiller(req: Request, res: Response): Promise<Response<void>> {
    const { biller_id } = req.params

    if (!biller_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Biller ID is required' })
    }

    const deletedCount = await db(TABLES.BILLER).where({ biller_id }).del()

    if (deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Biller not found' })
    }

    return res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default new BillerService()
