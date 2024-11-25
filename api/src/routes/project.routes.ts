import express from 'express'
import projectController from '~/controller/project.controller'

const router = express.Router()

router.get('/', projectController.getAllProjects)
router.get('/:project_id', projectController.getProjectById)
router.post('/', projectController.createProject)
router.put('/:project_id', projectController.updateProject)
router.delete('/:project_id', projectController.deleteProject)

export default router
