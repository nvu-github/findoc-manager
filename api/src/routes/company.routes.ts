import express from 'express'
import companyController from '~/controller/company.controller'

const router = express.Router()

router.get('/', companyController.getAllCompanies)
router.get('/:company_id', companyController.getCompanyById)
router.post('/', companyController.createCompany)
router.put('/:company_id', companyController.updateCompany)
router.delete('/:company_id', companyController.deleteCompany)

export default router
