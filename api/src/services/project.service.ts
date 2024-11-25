import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import db from '~/config/database'
import { TABLES } from '~/constants'
import { IProject } from '~/interfaces'

class ProjectService {
  async createProject(req: Request, res: Response): Promise<Response<IProject>> {
    const { project_name, company_id, description } = req.body

    if (!project_name || !company_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Project name and company ID are required' })
    }

    const [createdProject] = await db(TABLES.PROJECT).insert({ project_name, company_id, description }).returning('*')
    return res.status(StatusCodes.CREATED).json(createdProject)
  }

  async getAllProjects(req: Request, res: Response): Promise<Response<IProject[]>> {
    const projects = await db(TABLES.PROJECT)
      .join(TABLES.COMPANY, `projects.company_id`, `${TABLES.COMPANY}.company_id`)
      .select(`projects.*`, `companies.company_name as company_name`, `projects.project_id as id`)
      .orderBy('projects.project_id', 'asc')
    return res.status(StatusCodes.OK).json(projects)
  }

  async getProjectById(req: Request, res: Response): Promise<Response<IProject>> {
    const { project_id } = req.params

    const project = await db(TABLES.PROJECT).where({ project_id }).first()

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' })
    }

    return res.status(StatusCodes.OK).json(project)
  }

  async findProjectById(project_id: number): Promise<IProject | undefined> {
    return db(TABLES.PROJECT).where({ project_id }).first()
  }

  async updateProject(req: Request, res: Response): Promise<Response<IProject>> {
    const { project_id } = req.params
    const { project_name, company_id, description } = req.body

    if (!project_id || !project_name || !company_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Project ID, name, and company ID are required' })
    }

    const [updatedProject] = await db(TABLES.PROJECT)
      .where({ project_id })
      .update({ project_name, company_id, description })
      .returning('*')

    if (!updatedProject) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' })
    }

    return res.status(StatusCodes.OK).json(updatedProject)
  }

  async deleteProject(req: Request, res: Response): Promise<Response<void>> {
    const { project_id } = req.params

    if (!project_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Project ID is required' })
    }

    const deletedCount = await db(TABLES.PROJECT).where({ project_id }).del()

    if (deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' })
    }

    return res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default new ProjectService()
