import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Row } from 'antd'

import { useAppDispatch } from '../../stores/hook'
import { getAllTaxRatesAsync } from '../../stores/slices'
import TaxRateForm from './components/TaxRateForm'
import TaxRateList from './components/TaxRateList'
import { TaxRate } from '../../types'

const TaxRatesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [taxRateEdit, setTaxRateEdit] = useState<TaxRate | undefined>()
  const [loading, setLoading] = useState(false)

  const handleDrawerClose = (isOnSuccess?: boolean) => {
    setTaxRateEdit(undefined)
    setIsDrawerVisible(false)
    if (isOnSuccess) dispatch(getAllTaxRatesAsync({}))
  }

  useEffect(() => {
    setLoading(true)
    dispatch(getAllTaxRatesAsync({})).finally(() => setLoading(false))
  }, [dispatch])

  return (
    <div>
      <Row style={styles.fullWidth}>
        <Col span={24}>
          <h1>Manage Tax Rates</h1>
        </Col>
      </Row>
      <Row justify='end' style={styles.addButtonRow}>
        <Col>
          <Button type='primary' onClick={() => setIsDrawerVisible(true)}>
            Add Tax Rate
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <TaxRateList handleTaxRateEdit={setTaxRateEdit} handleDrawerVisible={setIsDrawerVisible} loading={loading} />
        </Col>
      </Row>
      <Drawer
        title={taxRateEdit ? 'Edit Tax Rate' : 'Add Tax Rate'}
        onClose={() => handleDrawerClose()}
        open={isDrawerVisible}
      >
        <TaxRateForm
          isDrawerVisible={isDrawerVisible}
          taxRate={taxRateEdit}
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

export default TaxRatesPage
