import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('documents').del()
  await knex('bookings').del()
  await knex('currencies').del()
  await knex('billers').del()
  await knex('accounts').del()
  await knex('companies').del()

  await knex('companies').insert([
    {
      company_id: 1,
      name: 'Tech Corp',
      address: '123 Tech Street, Silicon Valley',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      company_id: 2,
      name: 'Health Inc',
      address: '456 Health Ave, Wellness City',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('accounts').insert([
    {
      account_id: 1,
      company_id: 1,
      name: 'Sales Account',
      description: 'Account for managing sales transactions',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      account_id: 2,
      company_id: 2,
      name: 'Expense Account',
      description: 'Account for tracking company expenses',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('billers').insert([
    {
      biller_id: 1,
      name: 'Utility Biller',
      address: '789 Utility Lane, Service Town',
      biller_type: 'biller',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      biller_id: 2,
      name: 'Supplier Biller',
      address: '321 Supplier Blvd, Commerce City',
      biller_type: 'payer',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('currencies').insert([
    {
      currency_id: 1,
      currency_code: 'USD',
      date: '2024-11-01',
      exchange_rate: 1.0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      currency_id: 2,
      currency_code: 'EUR',
      date: '2024-11-01',
      exchange_rate: 0.85,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('bookings').insert([
    {
      booking_id: 1,
      company_id: 1,
      account_id: 1,
      biller_id: 1,
      currency_id: 1,
      date: '2024-11-01',
      amount: 1000.5,
      tax: 100.0,
      tax_rate: 10.0,
      description: 'Monthly utility payment',
      tags: 'Utilities',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      booking_id: 2,
      company_id: 2,
      account_id: 2,
      biller_id: 2,
      currency_id: 2,
      date: '2024-11-10',
      amount: 2000.0,
      tax: 200.0,
      tax_rate: 10.0,
      description: 'Office supplies purchase',
      tags: 'Supplies',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('documents').insert([
    {
      document_id: 1,
      booking_id: 1,
      file_url: 'https://example.com/documents/utility_invoice.pdf',
      uploaded_at: knex.fn.now(),
      metadata: JSON.stringify({ type: 'invoice', uploaded_by: 'admin' }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      document_id: 2,
      booking_id: 2,
      file_url: 'https://example.com/documents/supplies_invoice.pdf',
      uploaded_at: knex.fn.now(),
      metadata: JSON.stringify({ type: 'invoice', uploaded_by: 'admin' }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])
}
