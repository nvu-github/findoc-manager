import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { ICompany } from '~/interfaces'

class CompanyService {
  async createCompany(req: Request, res: Response): Promise<Response<ICompany>> {
    const { company_name, address, tax_id, default_currency } = req.body

    if (!company_name || !tax_id || !default_currency) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields are required' })
    }

    const [createdCompany] = await db(TABLES.COMPANY)
      .insert({ company_name, address, tax_id, default_currency })
      .returning('*')
    return res.status(StatusCodes.CREATED).json(createdCompany)
  }

  async getAllCompanies(req: Request, res: Response): Promise<Response<ICompany[]>> {
    const companies = await db(TABLES.COMPANY).select('*', 'companies.company_id as id')
    return res.status(StatusCodes.OK).json(companies)
  }

  async getCompanyById(req: Request, res: Response): Promise<Response<ICompany>> {
    const { company_id } = req.params

    const company = await db(TABLES.COMPANY).where({ company_id }).first()

    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Company not found' })
    }

    return res.status(StatusCodes.OK).json(company)
  }

  async findCompanyById(company_id: number): Promise<ICompany | undefined> {
    return db(TABLES.COMPANY).where({ company_id }).first()
  }

  async updateCompany(req: Request, res: Response): Promise<Response<ICompany>> {
    const { company_id } = req.params
    const { company_name, address, tax_id, default_currency } = req.body

    if (!company_id || !company_name || !tax_id || !default_currency) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Company ID and all fields are required' })
    }

    const updatedCompany = await db(TABLES.COMPANY)
      .where({ company_id })
      .update({ company_name, address, tax_id, default_currency })
      .returning('*')

    if (!updatedCompany) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Company not found' })
    }

    return res.status(StatusCodes.OK).json(updatedCompany)
  }

  async deleteCompany(req: Request, res: Response): Promise<Response<void>> {
    const { company_id } = req.params

    if (!company_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Company ID is required' })
    }

    const deletedCount = await db(TABLES.COMPANY).where({ company_id }).del()

    if (deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Company not found' })
    }

    return res.sendStatus(StatusCodes.NO_CONTENT)
  }
}

export default new CompanyService()
