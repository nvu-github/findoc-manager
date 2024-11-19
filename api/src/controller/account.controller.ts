import { Request, Response } from 'express'
import accountService from '~/services/account.service'
import { StatusCodes } from 'http-status-codes'

class AccountController {
  async createAccount(req: Request, res: Response): Promise<Response> {
    try {
      return await accountService.createAccount(req, res)
    } catch (error) {
      console.error('Error creating account:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create account' })
    }
  }

  async getAllAccounts(req: Request, res: Response): Promise<Response> {
    try {
      return await accountService.getAllAccounts(req, res)
    } catch (error) {
      console.error('Error fetching accounts:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch accounts' })
    }
  }

  async getAccountById(req: Request, res: Response): Promise<Response> {
    try {
      return await accountService.getAccountById(req, res)
    } catch (error) {
      console.error('Error fetching account:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch account' })
    }
  }

  async updateAccount(req: Request, res: Response): Promise<Response> {
    try {
      return await accountService.updateAccount(req, res)
    } catch (error) {
      console.error('Error updating account:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update account' })
    }
  }

  async deleteAccount(req: Request, res: Response): Promise<Response> {
    try {
      return await accountService.deleteAccount(req, res)
    } catch (error) {
      console.error('Error deleting account:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete account' })
    }
  }
}

export default new AccountController()
