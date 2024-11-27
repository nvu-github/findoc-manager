import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { IAccount } from '~/interfaces'

class AccountService {
  async createAccount(req: Request, res: Response): Promise<Response<IAccount>> {
    const account: Omit<IAccount, 'account_id'> = req.body

    if (!account || !account.company_id || !account.account_name || !account.account_number || !account.currency) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or missing account data' })
    }

    const [createdAccount] = await db(TABLES.ACCOUNT).insert(account).returning('*')
    return res.status(StatusCodes.CREATED).json(createdAccount)
  }

  async getAllAccounts(req: Request, res: Response): Promise<Response<IAccount[]>> {
    const accounts = await db(TABLES.ACCOUNT)
      .join(TABLES.COMPANY, `accounts.company_id`, `companies.company_id`)
      .select(`accounts.*`, `accounts.account_id as id`, `companies.company_name as companyName`)
      .orderBy('accounts.account_id', 'asc')

    return res.status(StatusCodes.OK).json(accounts)
  }

  async getAccountById(req: Request, res: Response): Promise<Response<IAccount>> {
    const { account_id } = req.params

    const account = await db(TABLES.ACCOUNT).where({ account_id }).first()

    if (!account) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' })
    }

    return res.status(StatusCodes.OK).json(account)
  }

  async findAccountById(account_id: number): Promise<IAccount | undefined> {
    return db(TABLES.ACCOUNT).where({ account_id }).first()
  }

  async updateAccount(req: Request, res: Response): Promise<Response<IAccount>> {
    const { account_id } = req.params
    const account: Partial<IAccount> = req.body

    if (!account_id || !account) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Account ID and account data are required' })
    }

    const updatedAccount = await db(TABLES.ACCOUNT).where({ account_id }).update(account).returning('*')

    if (updatedAccount.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Account not found' })
    }

    return res.status(StatusCodes.OK).json(updatedAccount[0])
  }

  async deleteAccount(req: Request, res: Response): Promise<Response<void>> {
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

export default new AccountService()
