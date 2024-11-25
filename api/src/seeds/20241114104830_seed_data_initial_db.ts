import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('documents').del()
  await knex('bookings').del()
  await knex('tax_rates').del()
  await knex('currencies').del()
  await knex('billers').del()
  await knex('accounts').del()
  await knex('projects').del()
  await knex('companies').del()

  await knex('companies').insert([
    {
      company_id: 1,
      company_name: 'Tech Innovators',
      address: '123 Innovation Drive, Tech City',
      tax_id: 'TAX123456',
      default_currency: 'USD',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      company_id: 2,
      company_name: 'Health Plus Inc.',
      address: '456 Wellness Blvd, Health Town',
      tax_id: 'TAX654321',
      default_currency: 'EUR',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('accounts').insert([
    {
      account_id: 1,
      account_name: 'Corporate Account',
      company_id: 1,
      account_number: 'ACC12345',
      currency: 'USD',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      account_id: 2,
      account_name: 'Expense Account',
      company_id: 2,
      account_number: 'ACC67890',
      currency: 'EUR',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('billers').insert([
    {
      biller_id: 1,
      name: 'Utility Biller Co.',
      address: '789 Utility Lane, Billing City',
      tax_id: 'BILL123456',
      default_currency: 'USD',
      contact_info: 'info@utilitybiller.com',
      biller_type: 'biller',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      biller_id: 2,
      name: 'Office Supplies Supplier',
      address: '321 Supplier Blvd, Commerce City',
      tax_id: 'SUPPLY654321',
      default_currency: 'EUR',
      contact_info: 'contact@supplier.com',
      biller_type: 'payer',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('projects').insert([
    {
      project_id: 1,
      project_name: 'AI Research Project',
      company_id: 1,
      description: 'Developing AI algorithms for automated tasks',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      project_id: 2,
      project_name: 'Wellness Campaign',
      company_id: 2,
      description: 'Health awareness campaign for the community',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('currencies').insert([
    {
      currency_code: 'USD',
      exchange_rate: 1.0,
      last_updated: knex.fn.now()
    },
    {
      currency_code: 'EUR',
      exchange_rate: 0.85,
      last_updated: knex.fn.now()
    }
  ])

  await knex('tax_rates').insert([
    {
      tax_rate_id: 1,
      region: 'US',
      rate: 7.5,
      description: 'Standard US Sales Tax',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      tax_rate_id: 2,
      region: 'EU',
      rate: 20.0,
      description: 'Standard EU VAT',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])

  await knex('bookings').insert([
    {
      booking_id: 1,
      company_id: 1,
      account_id: 1,
      tax_rate_id: 1,
      invoice_issuer_id: 1,
      invoice_recipient_id: 1,
      entry_date: '2024-11-01',
      invoice_date: '2024-11-01',
      invoice_received_date: null,
      total_amount: 500.0,
      tax_amount: 37.5,
      tax_rate: 7.5,
      expense_category: 'Utilities',
      tags: 'Monthly Bills',
      currency: 'USD',
      due_date: '2024-11-15',
      payment_status: 'unpaid',
      reference_number: 'INV001',
      project_cost_center: 1,
      notes: 'Payment for office utilities',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      booking_id: 2,
      company_id: 2,
      account_id: 2,
      tax_rate_id: 2,
      invoice_issuer_id: 2,
      invoice_recipient_id: 2,
      entry_date: '2024-11-10',
      invoice_date: '2024-11-09',
      invoice_received_date: '2024-11-10',
      total_amount: 1200.0,
      tax_amount: 240.0,
      tax_rate: 20.0,
      expense_category: 'Supplies',
      tags: 'Office Supplies',
      currency: 'EUR',
      due_date: '2024-12-10',
      payment_status: 'partially_paid',
      reference_number: 'SUPPLY001',
      project_cost_center: 2,
      notes: 'Office supplies for the month',
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
