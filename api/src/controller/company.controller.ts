import { Request, Response } from 'express'
import companyService from '~/services/company.service'
import { StatusCodes } from 'http-status-codes'

class companyController {
  async createCompany(req: Request, res: Response): Promise<Response> {
    try {
      return await companyService.createCompany(req, res)
    } catch (error) {
      console.error('Error creating company:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create company' })
    }
  }

  async getAllCompanies(req: Request, res: Response): Promise<Response> {
    try {
      return await companyService.getAllCompanies(req, res)
    } catch (error) {
      console.error('Error fetching companies:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch companies' })
    }
  }

  async getCompanyById(req: Request, res: Response): Promise<Response> {
    try {
      return await companyService.getCompanyById(req, res)
    } catch (error) {
      console.error('Error fetching company:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch company' })
    }
  }

  async updateCompany(req: Request, res: Response): Promise<Response> {
    try {
      return await companyService.updateCompany(req, res)
    } catch (error) {
      console.error('Error updating company:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update company' })
    }
  }

  async deleteCompany(req: Request, res: Response): Promise<Response> {
    try {
      return await companyService.deleteCompany(req, res)
    } catch (error) {
      console.error('Error deleting company:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete company' })
    }
  }
}

export default new companyController()
