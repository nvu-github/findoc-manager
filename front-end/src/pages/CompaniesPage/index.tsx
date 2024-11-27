import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Row } from 'antd'

import { useAppDispatch } from '../../stores/hook'
import { getAllCompanyAsync } from '../../stores/slices/company.slice'
import CompanyForm from './components/CompanyForm'
import CompanyList from './components/CompanyList'
import { Company } from '../../types'
import { getAllCurrenciesAsync } from '../../stores/slices/currency.slice'

const CompaniesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [companyEdit, setCompanyEdit] = useState<Company | undefined>()

  const handleDrawerClose = (isOnSuccess?: boolean) => {
    setCompanyEdit(undefined)
    setIsDrawerVisible(false)
    if (isOnSuccess) dispatch(getAllCompanyAsync({}))
  }

  useEffect(() => {
    dispatch(getAllCompanyAsync({}))
    dispatch(getAllCurrenciesAsync())
  }, [dispatch])

  return (
    <div>
      <Row style={styles.fullWidth}>
        <Col span={24}>
          <h1>Manage Companies</h1>
        </Col>
      </Row>
      <Row justify='end' style={styles.addButtonRow}>
        <Col>
          <Button type='primary' onClick={() => setIsDrawerVisible(true)}>
            Add Company
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <CompanyList handleCompanyEdit={setCompanyEdit} handleDrawerVisible={setIsDrawerVisible} />
        </Col>
      </Row>
      <Drawer
        title={companyEdit ? 'Edit Company' : 'Add Company'}
        onClose={() => handleDrawerClose()}
        open={isDrawerVisible}
      >
        <CompanyForm
          isDrawerVisible={isDrawerVisible}
          company={companyEdit}
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

export default CompaniesPage
