import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Row } from 'antd'

import { useAppDispatch } from '../../stores/hook'
import { getAllAccountsAsync } from '../../stores/slices/account.slice'
import { getAllCompanyAsync } from '../../stores/slices/company.slice'
import AccountForm from './components/AccountForm'
import AccountList from './components/AccountList'
import { Account, Company } from '../../types'

const AccountsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [accountEdit, setAccountEdit] = useState<Account | undefined>()
  const [companies, setCompanies] = useState<Company[]>([])

  const handleDrawerClose = (isOnSuccess?: boolean) => {
    setAccountEdit(undefined)
    setIsDrawerVisible(false)
    if (isOnSuccess) dispatch(getAllAccountsAsync({}))
  }

  useEffect(() => {
    dispatch(getAllAccountsAsync({}))
    dispatch(getAllCompanyAsync({})).then((response: any) => {
      setCompanies(response.payload || [])
    })
  }, [dispatch])

  return (
    <div>
      <Row style={styles.fullWidth}>
        <Col span={24}>
          <h1>Manage Accounts</h1>
        </Col>
      </Row>
      <Row justify='end' style={styles.addButtonRow}>
        <Col>
          <Button type='primary' onClick={() => setIsDrawerVisible(true)}>
            Add Account
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <AccountList handleAccountEdit={setAccountEdit} handleDrawerVisible={setIsDrawerVisible} />
        </Col>
      </Row>
      <Drawer
        title={accountEdit ? 'Edit Account' : 'Add Account'}
        onClose={() => handleDrawerClose()}
        open={isDrawerVisible}
      >
        <AccountForm
          isDrawerVisible={isDrawerVisible}
          account={accountEdit}
          companies={companies}
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

export default AccountsPage
