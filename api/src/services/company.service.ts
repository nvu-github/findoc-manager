import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { ICompany } from '~/interfaces'

class CompanyService {
  async createCompany(req: Request, res: Response): Promise<Response<ICompany>> {
    const { name, address } = req.body

    const [createdCompany] = await db(TABLES.COMPANY).insert({ name, address })
    return res.status(StatusCodes.CREATED).json(createdCompany)
  }

  async getAllCompanies(req: Request, res: Response): Promise<Response<ICompany[]>> {
    const companies = await db(TABLES.COMPANY).select('companies.*', 'companies.company_id as id')
    return res.json(companies)
  }

  async getCompanyById(req: Request, res: Response): Promise<Response<ICompany>> {
    const { company_id } = req.params
    const company = await db(TABLES.COMPANY).where({ company_id }).first()
    if (!company) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Company not found' })
    }
    return res.json(company)
  }

  async findCompanyById(company_id: number) {
    return await db(TABLES.COMPANY).where('companies.company_id', company_id).first()
  }

  async updateCompany(req: Request, res: Response): Promise<Response<ICompany>> {
    const { company_id } = req.params
    const { name, address } = req.body
    if (!company_id || !name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Company ID and name are required' })
    }

    const updatedCompany = await db(TABLES.COMPANY).where({ company_id }).update({ name, address }).returning('*')

    if (updatedCompany.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Company not found' })
    }
    return res.json(updatedCompany[0])
  }

  async deleteCompany(req: Request, res: Response): Promise<Response<ICompany>> {
    const { company_id } = req.params
    if (!company_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Company ID is required' })
    }

    const deletedCompany = await db(TABLES.COMPANY).where({ company_id }).del()
    if (deletedCompany === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Company not found' })
    }
    return res.sendStatus(StatusCodes.OK)
  }
}

export default new CompanyService()
