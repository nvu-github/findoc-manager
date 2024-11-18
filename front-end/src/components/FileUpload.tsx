import React from 'react'
import { Upload, message, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from '../services/api'

const FileUpload: React.FC = () => {
  const props = {
    name: 'file',
    action: '/api/documents/upload',
    headers: {
      authorization: 'authorization-text'
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Upload File</Button>
    </Upload>
  )
}

export default FileUpload
