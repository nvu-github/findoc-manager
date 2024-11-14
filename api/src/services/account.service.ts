import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { IAccount } from '~/interfaces'

class accountService {
  async createAccount(req: Request, res: Response): Promise<Response<IAccount>> {
    const { account } = req.body
    if (!account) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Account data is required' })
    }

    const [createdAccount] = await db(TABLES.ACCOUNT).insert(account).returning('*')
    return res.status(StatusCodes.CREATED).json(createdAccount)
  }

  async getAllAccounts(req: Request, res: Response): Promise<Response<IAccount[]>> {
    const accounts = await db(TABLES.ACCOUNT).select()
    return res.json(accounts)
  }

  async getAccountById(req: Request, res: Response): Promise<Response<IAccount>> {
    const { account_id } = req.params
    const account = await db(TABLES.ACCOUNT).where({ account_id }).first()
    if (!account) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' })
    }
    return res.json(account)
  }

  async updateAccount(req: Request, res: Response): Promise<Response<IAccount>> {
    const { account_id } = req.params
    const { account } = req.body
    if (!account_id || !account) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Account ID and account data are required' })
    }
    const updatedAccount = await db(TABLES.ACCOUNT).where({ account_id }).update(account).returning('*')
    if (updatedAccount.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' })
    }
    return res.json(updatedAccount[0])
  }

  async deleteAccount(req: Request, res: Response): Promise<Response<IAccount>> {
    const { account_id } = req.params
    if (!account_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Account ID is required' })
    }
    const deletedAccount = await db(TABLES.ACCOUNT).where({ account_id }).del()
    if (deletedAccount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' })
    }
    return res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default new accountService()
