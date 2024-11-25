import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Row } from 'antd'

import { useAppDispatch } from '../../stores/hook'
import { getAllBillersAsync } from '../../stores/slices/biller.slice'
import BillerForm from './components/BillerForm'
import BillerList from './components/BillerList'
import { Biller } from '../../types'
import { getAllCurrenciesAsync } from '../../stores/slices/currency.slice'

const BillersPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [billerEdit, setBillerEdit] = useState<Biller | undefined>()

  const handleDrawerClose = (isOnSuccess?: boolean) => {
    setBillerEdit(undefined)
    setIsDrawerVisible(false)
    if (isOnSuccess) dispatch(getAllBillersAsync({}))
  }

  useEffect(() => {
    dispatch(getAllBillersAsync({}))
    dispatch(getAllCurrenciesAsync())
  }, [dispatch])

  return (
    <div>
      <Row style={styles.fullWidth}>
        <Col span={24}>
          <h1>Manage Billers</h1>
        </Col>
      </Row>
      <Row justify='end' style={styles.addButtonRow}>
        <Col>
          <Button type='primary' onClick={() => setIsDrawerVisible(true)}>
            Add Biller
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <BillerList handleBillerEdit={setBillerEdit} handleDrawerVisible={setIsDrawerVisible} />
        </Col>
      </Row>
      <Drawer
        title={billerEdit ? 'Edit Biller' : 'Add Biller'}
        onClose={() => handleDrawerClose()}
        open={isDrawerVisible}
      >
        <BillerForm isDrawerVisible={isDrawerVisible} biller={billerEdit} onSuccess={() => handleDrawerClose(true)} />
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

export default BillersPage
