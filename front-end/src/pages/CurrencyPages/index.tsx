import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Row } from 'antd'

import { useAppDispatch } from '../../stores/hook'
import { getAllCurrenciesAsync } from '../../stores/slices/currency.slice'
import CurrencyForm from './components/CurrencyForm'
import CurrencyList from './components/CurrencyList'
import { Currency } from '../../types'

const CurrenciesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [currencyEdit, setCurrencyEdit] = useState<Currency | undefined>()

  const handleDrawerClose = (isOnSuccess?: boolean) => {
    setCurrencyEdit(undefined)
    setIsDrawerVisible(false)
    if (isOnSuccess) dispatch(getAllCurrenciesAsync())
  }

  useEffect(() => {
    dispatch(getAllCurrenciesAsync())
  }, [dispatch])

  return (
    <div>
      <Row style={styles.fullWidth}>
        <Col span={24}>
          <h1>Manage Currencies</h1>
        </Col>
      </Row>
      <Row justify='end' style={styles.addButtonRow}>
        <Col>
          <Button type='primary' onClick={() => setIsDrawerVisible(true)}>
            Add Currency
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <CurrencyList handleCurrencyEdit={setCurrencyEdit} handleDrawerVisible={setIsDrawerVisible} />
        </Col>
      </Row>
      <Drawer
        title={currencyEdit ? 'Edit Currency' : 'Add Currency'}
        onClose={() => handleDrawerClose()}
        open={isDrawerVisible}
      >
        <CurrencyForm
          isDrawerVisible={isDrawerVisible}
          currency={currencyEdit}
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

export default CurrenciesPage
