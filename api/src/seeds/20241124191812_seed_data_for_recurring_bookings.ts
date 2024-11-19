import * as Knex from 'knex'
import moment from 'moment'

export async function seed(knex: Knex): Promise<void> {
  await knex('recurring_bookings').del()

  await knex('recurring_bookings').insert([
    {
      recurring_booking_id: 1,
      company_id: 1,
      account_id: 1,
      biller_id: 1,
      currency_id: 1,
      amount: 1500.0,
      tax: 150.0,
      tax_rate: 10.0,
      description: 'Monthly subscription for cloud services',
      tags: 'cloud, subscription',
      recurrence_interval: 'monthly',
      next_run_date: moment().add(1, 'month').format('YYYY-MM-DD'),
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      recurring_booking_id: 2,
      company_id: 2,
      account_id: 2,
      biller_id: 2,
      currency_id: 2,
      amount: 800.0,
      tax: 80.0,
      tax_rate: 10.0,
      description: 'Quarterly office supplies purchase',
      tags: 'supplies, quarterly',
      recurrence_interval: 'yearly',
      next_run_date: moment().add(3, 'months').format('YYYY-MM-DD'),
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      recurring_booking_id: 3,
      company_id: 1,
      account_id: 1,
      biller_id: 1,
      currency_id: 1,
      amount: 100.0,
      tax: 0.0,
      tax_rate: 0.0,
      description: 'Weekly equipment maintenance',
      tags: 'maintenance, weekly',
      recurrence_interval: 'weekly',
      next_run_date: moment().add(1, 'week').format('YYYY-MM-DD'),
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      recurring_booking_id: 4,
      company_id: 2,
      account_id: 2,
      biller_id: 2,
      currency_id: 2,
      amount: 5000.0,
      tax: 500.0,
      tax_rate: 10.0,
      description: 'Yearly insurance payment',
      tags: 'insurance, yearly',
      recurrence_interval: 'yearly',
      next_run_date: moment().add(1, 'year').format('YYYY-MM-DD'),
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ])
}
