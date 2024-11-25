import React, { useCallback, useEffect } from 'react'
import { Form, Input, Button, message, Select } from 'antd'

import { useAppDispatch, useAppSelector } from '../../../stores/hook'
import { addProjectAsync, updateProjectAsync } from '../../../stores/slices'
import { Company, Project } from '../../../types'

interface ProjectFormProps {
  isDrawerVisible: boolean
  project?: Project | undefined
  onSuccess: () => void
}

const rules = {
  projectName: [{ required: true, message: 'Please input project name' }],
  companyId: [{ required: true, message: 'Please input company ID' }],
  description: [{ required: false }]
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isDrawerVisible, project, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const { companies } = useAppSelector((state) => state.company)

  const handleSubmit = async (values: Project) => {
    try {
      if (project?.projectId) {
        const projectId = project.projectId
        await dispatch(updateProjectAsync({ projectId, updatedProject: values }))
        message.success('Project updated successfully')
      } else {
        await dispatch(addProjectAsync(values))
        message.success('Project created successfully')
      }
    } catch (error: any) {
      console.error('An error occurred', error)
      message.error(error || 'Failed to save project')
    } finally {
      onSuccess()
    }
  }

  const handleSetDataEditProject = useCallback(() => {
    if (project) {
      form.setFieldsValue(project)
    }
  }, [project, form])

  useEffect(() => {
    handleSetDataEditProject()
    if (!isDrawerVisible && !project?.projectId) form.resetFields()
  }, [isDrawerVisible, project, form, handleSetDataEditProject])

  return (
    <Form form={form} layout='vertical' onFinish={handleSubmit} style={styles.form}>
      <Form.Item name='projectName' label='Project Name' rules={rules.projectName}>
        <Input placeholder='e.g., AI Research Project' />
      </Form.Item>
      <Form.Item name='companyId' label='Company' rules={rules.companyId}>
        <Select placeholder='Select a company'>
          {companies.map((company: Company) => (
            <Select.Option key={company.companyId} value={company.companyId}>
              {company.companyName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='description' label='Description' rules={rules.description}>
        <Input.TextArea placeholder='Describe the project' />
      </Form.Item>
      <Button type='primary' htmlType='submit' style={styles.submitButton}>
        {project?.projectId ? 'Update Project' : 'Create Project'}
      </Button>
    </Form>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  submitButton: {
    marginTop: '16px'
  }
}

export default ProjectForm
