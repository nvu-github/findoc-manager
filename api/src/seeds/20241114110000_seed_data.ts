import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('recurring_bookings').del()
  await knex('currencies').del()
  await knex('documents').del()
  await knex('bookings').del()
  await knex('billers').del()
  await knex('accounts').del()
  await knex('companies').del()

  await knex('companies').insert([
    {
      company_id: 1,
      name: 'Tech Corp',
      address: '123 Tech Street, Silicon Valley',
      tax_id: 'TAX12345',
      default_currency: 'USD'
    },
    {
      company_id: 2,
      name: 'Health Inc',
      address: '456 Health Ave, Wellness City',
      tax_id: 'TAX67890',
      default_currency: 'EUR'
    }
  ])

  await knex('accounts').insert([
    { account_id: 1, company_id: 1, name: 'Sales Account', description: 'Account for managing sales transactions' },
    { account_id: 2, company_id: 2, name: 'Expense Account', description: 'Account for tracking company expenses' }
  ])

  await knex('billers').insert([
    {
      biller_id: 1,
      name: 'Utility Biller',
      address: '789 Utility Lane, Service Town',
      tax_id: 'BILL123',
      default_currency: 'USD'
    },
    {
      biller_id: 2,
      name: 'Supplier Biller',
      address: '321 Supplier Blvd, Commerce City',
      tax_id: 'BILL456',
      default_currency: 'EUR'
    }
  ])

  await knex('bookings').insert([
    {
      booking_id: 1,
      company_id: 1,
      account_id: 1,
      biller_id: 1,
      date: '2024-11-01',
      amount: 1000.5,
      currency: 'USD',
      exchange_rate: 1.0,
      description: 'Monthly utility payment',
      tax_amount: 100.0,
      tag: 'Utilities',
      invoice_date: '2024-11-01',
      payment_date: '2024-11-05',
      tax_date: '2024-11-01'
    },
    {
      booking_id: 2,
      company_id: 2,
      account_id: 2,
      biller_id: 2,
      date: '2024-11-10',
      amount: 2000.0,
      currency: 'EUR',
      exchange_rate: 1.0,
      description: 'Office supplies purchase',
      tax_amount: 200.0,
      tag: 'Supplies',
      invoice_date: '2024-11-10',
      payment_date: '2024-11-15',
      tax_date: '2024-11-10'
    }
  ])

  await knex('documents').insert([
    {
      document_id: 1,
      booking_id: 1,
      file_url: 'https://example.com/documents/utility_invoice.pdf',
      uploaded_at: knex.fn.now(),
      metadata: JSON.stringify({ type: 'invoice', uploaded_by: 'admin' })
    },
    {
      document_id: 2,
      booking_id: 2,
      file_url: 'https://example.com/documents/supplies_invoice.pdf',
      uploaded_at: knex.fn.now(),
      metadata: JSON.stringify({ type: 'invoice', uploaded_by: 'admin' })
    }
  ])

  await knex('currencies').insert([
    { currency_code: 'USD', date: '2024-11-01', exchange_rate: 1.0 },
    { currency_code: 'EUR', date: '2024-11-01', exchange_rate: 0.85 },
    { currency_code: 'USD', date: '2024-11-10', exchange_rate: 1.0 },
    { currency_code: 'EUR', date: '2024-11-10', exchange_rate: 0.86 }
  ])

  await knex('recurring_bookings').insert([
    {
      recurring_id: 1,
      company_id: 1,
      account_id: 1,
      biller_id: 1,
      amount: 500.0,
      currency: 'USD',
      exchange_rate: 1.0,
      description: 'Monthly internet subscription',
      tax_amount: 50.0,
      tag: 'Internet',
      next_occurrence: '2024-12-01',
      frequency: 'monthly'
    },
    {
      recurring_id: 2,
      company_id: 2,
      account_id: 2,
      biller_id: 2,
      amount: 300.0,
      currency: 'EUR',
      exchange_rate: 0.85,
      description: 'Quarterly maintenance fee',
      tax_amount: 30.0,
      tag: 'Maintenance',
      next_occurrence: '2025-02-10',
      frequency: 'quarterly'
    }
  ])
}
