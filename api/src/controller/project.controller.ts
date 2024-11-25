import { Request, Response } from 'express'
import projectService from '~/services/project.service'
import { StatusCodes } from 'http-status-codes'

class ProjectController {
  async createProject(req: Request, res: Response): Promise<Response> {
    try {
      return await projectService.createProject(req, res)
    } catch (error) {
      console.error('Error creating project:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create project' })
    }
  }

  async getAllProjects(req: Request, res: Response): Promise<Response> {
    try {
      return await projectService.getAllProjects(req, res)
    } catch (error) {
      console.error('Error fetching projects:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch projects' })
    }
  }

  async getProjectById(req: Request, res: Response): Promise<Response> {
    try {
      return await projectService.getProjectById(req, res)
    } catch (error) {
      console.error('Error fetching project:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch project' })
    }
  }

  async updateProject(req: Request, res: Response): Promise<Response> {
    try {
      return await projectService.updateProject(req, res)
    } catch (error) {
      console.error('Error updating project:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update project' })
    }
  }

  async deleteProject(req: Request, res: Response): Promise<Response> {
    try {
      return await projectService.deleteProject(req, res)
    } catch (error) {
      console.error('Error deleting project:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete project' })
    }
  }
}

export default new ProjectController()
