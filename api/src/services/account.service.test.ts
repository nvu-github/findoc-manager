import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import accountService from '~/services/account.service'
import { TABLES } from '~/constants'
import db from '~/config/database'

jest.mock('~/config/database', () => {
  const mKnex = {
    insert: jest.fn(),
    select: jest.fn(),
    where: jest.fn()
  }
  return jest.fn(() => mKnex)
})

describe('accountService', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let jsonMock: jest.Mock
  let statusMock: jest.Mock

  beforeEach(() => {
    req = {}
    jsonMock = jest.fn()
    statusMock = jest.fn().mockReturnValue({ json: jsonMock })
    res = {
      json: jsonMock,
      status: statusMock,
      send: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createAccount', () => {
    it('should create an account and return the created account', async () => {
      req.body = { account: { name: 'John Doe' } }
      const createdAccount = { id: 1, name: 'John Doe' }

      ;(db(TABLES.ACCOUNT).insert as jest.Mock).mockResolvedValue([createdAccount])

      await accountService.createAccount(req as Request, res as Response)

      expect(db(TABLES.ACCOUNT).insert).toHaveBeenCalledWith(req.body.account)
      expect(jsonMock).toHaveBeenCalledWith(createdAccount)
      expect(statusMock).toHaveBeenCalledWith(StatusCodes.CREATED)
    })

    it('should return 400 if account data is missing', async () => {
      req.body = {}

      await accountService.createAccount(req as Request, res as Response)

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Account data is required' })
    })
  })

  describe('getAllAccounts', () => {
    it('should return all accounts', async () => {
      const accounts = [{ id: 1, name: 'John Doe' }]
      ;(db(TABLES.ACCOUNT).select as jest.Mock).mockResolvedValue(accounts)

      await accountService.getAllAccounts(req as Request, res as Response)

      expect(db(TABLES.ACCOUNT).select).toHaveBeenCalled()
      expect(jsonMock).toHaveBeenCalledWith(accounts)
    })
  })

  describe('getAccountById', () => {
    it('should return the account if found', async () => {
      req.params = { account_id: '1' }
      const account = { id: 1, name: 'John Doe' }
      ;(db(TABLES.ACCOUNT).where as jest.Mock).mockReturnValue({
        first: jest.fn().mockResolvedValue(account)
      })

      await accountService.getAccountById(req as Request, res as Response)

      expect(db(TABLES.ACCOUNT).where).toHaveBeenCalledWith({ account_id: '1' })
      expect(jsonMock).toHaveBeenCalledWith(account)
    })

    it('should return 404 if account not found', async () => {
      req.params = { account_id: '1' }
      ;(db(TABLES.ACCOUNT).where as jest.Mock).mockReturnValue({
        first: jest.fn().mockResolvedValue(undefined)
      })

      await accountService.getAccountById(req as Request, res as Response)

      expect(statusMock).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Account not found' })
    })
  })
})
