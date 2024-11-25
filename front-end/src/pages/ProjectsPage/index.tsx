import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Row } from 'antd'

import { useAppDispatch } from '../../stores/hook'
import { getAllCompanyAsync, getAllProjectsAsync } from '../../stores/slices'
import ProjectForm from './components/ProjectForm'
import ProjectList from './components/ProjectList'
import { Project } from '../../types'

const ProjectsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [projectEdit, setProjectEdit] = useState<Project | undefined>()

  const handleDrawerClose = (isOnSuccess?: boolean) => {
    setProjectEdit(undefined)
    setIsDrawerVisible(false)
    if (isOnSuccess) dispatch(getAllProjectsAsync({}))
  }

  useEffect(() => {
    dispatch(getAllProjectsAsync({}))
    dispatch(getAllCompanyAsync({}))
  }, [dispatch])

  return (
    <div>
      <Row style={styles.fullWidth}>
        <Col span={24}>
          <h1>Manage Projects</h1>
        </Col>
      </Row>
      <Row justify='end' style={styles.addButtonRow}>
        <Col>
          <Button type='primary' onClick={() => setIsDrawerVisible(true)}>
            Add Project
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <ProjectList handleProjectEdit={setProjectEdit} handleDrawerVisible={setIsDrawerVisible} />
        </Col>
      </Row>
      <Drawer
        title={projectEdit ? 'Edit Project' : 'Add Project'}
        onClose={() => handleDrawerClose()}
        open={isDrawerVisible}
      >
        <ProjectForm
          isDrawerVisible={isDrawerVisible}
          project={projectEdit}
          onSuccess={() => handleDrawerClose(true)}
        />
      </Drawer>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  fullWidth: {
    width: '100%'
  },
  addButtonRow: {
    marginBottom: '16px',
    width: '100%'
  }
}

export default ProjectsPage
