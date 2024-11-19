import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { IBiller } from '~/interfaces'

class BillerService {
  async createBiller(req: Request, res: Response): Promise<Response<IBiller>> {
    const { name, address, biller_type } = req.body
    if (!name || !biller_type) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Biller name and biller type are required' })
    }

    const [createdBiller] = await db(TABLES.BILLER).insert({ name, address, biller_type }).returning('*')
    return res.status(StatusCodes.CREATED).json(createdBiller)
  }

  async getAllBillers(req: Request, res: Response): Promise<Response<IBiller[]>> {
    const billers = await db(TABLES.BILLER).select('billers.*', 'billers.biller_id as id')
    return res.json(billers)
  }

  async getBillerById(req: Request, res: Response): Promise<Response<IBiller>> {
    const { biller_id } = req.params
    const biller = await db(TABLES.BILLER).where({ biller_id }).first()
    if (!biller) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Biller not found' })
    }
    return res.json(biller)
  }

  async findBillerById(biller_id: number) {
    return await db(TABLES.BILLER).where('billers.biller_id', biller_id).first()
  }

  async updateBiller(req: Request, res: Response): Promise<Response<IBiller>> {
    const { biller_id } = req.params
    const { name, address, biller_type } = req.body
    if (!biller_id || !name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Biller ID and name are required' })
    }

    const updatedBiller = await db(TABLES.BILLER)
      .where({ biller_id })
      .update({ name, address, biller_type })
      .returning('*')
    if (updatedBiller.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Biller not found' })
    }
    return res.json(updatedBiller[0])
  }

  async deleteBiller(req: Request, res: Response): Promise<Response<IBiller>> {
    const { biller_id } = req.params
    if (!biller_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Biller ID is required' })
    }
    const deletedBiller = await db(TABLES.BILLER).where({ biller_id }).del()
    if (deletedBiller === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Biller not found' })
    }
    return res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default new BillerService()
