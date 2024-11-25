import React from 'react'
import { message } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { deleteProjectAsync, getAllProjectsAsync } from '../../../stores/slices/project.slice'
import TableData from '../../../components/TableData'
import { Project } from '../../../types'

interface ProjectListProps {
  handleProjectEdit: (project: Project) => void
  handleDrawerVisible: (visible: boolean) => void
}

const ProjectList: React.FC<ProjectListProps> = (props) => {
  const { handleProjectEdit, handleDrawerVisible } = props
  const dispatch = useAppDispatch()
  const { projects, loading } = useAppSelector((state) => state.project)

  const handleEditProject = (project: Project) => {
    handleProjectEdit(project)
    handleDrawerVisible(true)
  }

  const deleteProject = async (project: Project) => {
    try {
      const projectId: number = project.projectId!
      await dispatch(deleteProjectAsync(projectId))
      message.success('Project deleted successfully')
      await dispatch(getAllProjectsAsync({}))
    } catch (error) {
      console.error('Error deleting project', error)
      message.error('Failed to delete project')
    }
  }

  const columns = [
    { title: 'Project Name', dataIndex: 'projectName', key: 'projectName' },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString()
    }
  ]

  return (
    <TableData
      columns={columns}
      dataSource={projects}
      dataAction={{ titleConfirmDelete: 'Are you sure you want to delete this project?' }}
      isLoading={loading}
      handleEditRecord={handleEditProject}
      handleDeleteRecord={deleteProject}
    />
  )
}

export default ProjectList
