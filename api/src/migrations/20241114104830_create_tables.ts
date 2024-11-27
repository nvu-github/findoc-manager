import * as Knex from 'knex'
import { PAYMENT_STATUS, BILLER_TYPE } from '../constants'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('companies', (table) => {
    table.increments('company_id').unsigned().notNullable().primary()
    table.string('company_name').notNullable()
    table.text('address')
    table.string('tax_id').unique()
    table.string('default_currency')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('accounts', (table) => {
    table.increments('account_id').primary()
    table.string('account_name').notNullable()
    table.integer('company_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table.string('account_number').unique().notNullable()
    table.string('currency').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('billers', (table) => {
    table.increments('biller_id').unsigned().primary()
    table.string('name').notNullable()
    table.text('address')
    table.string('tax_id').unique()
    table.string('default_currency')
    table.text('contact_info')
    table.enum('biller_type', [BILLER_TYPE.BILLER, BILLER_TYPE.PAYER, BILLER_TYPE.RECIPIENT]).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('projects', (table) => {
    table.increments('project_id').primary()
    table.string('project_name').notNullable()
    table.integer('company_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('tax_rates', (table) => {
    table.increments('tax_rate_id').primary()
    table.string('region').notNullable()
    table.decimal('rate', 10, 5).notNullable()
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('bookings', (table) => {
    table.increments('booking_id').notNullable().primary()
    table.integer('account_id').unsigned().references('account_id').inTable('accounts').onDelete('CASCADE')
    table.integer('invoice_issuer_id').unsigned().references('biller_id').inTable('billers').onDelete('CASCADE')
    table.integer('invoice_recipient_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table
      .integer('tax_rate_id')
      .unsigned()
      .nullable()
      .references('tax_rate_id')
      .inTable('tax_rates')
      .onDelete('SET NULL')
    table.date('entry_date').notNullable()
    table.date('invoice_date').notNullable()
    table.date('invoice_received_date').nullable()
    table.decimal('total_amount', 15, 2).notNullable()
    table.decimal('tax_amount', 15, 2).notNullable()
    table.decimal('tax_rate', 10, 5).notNullable()
    table.string('expense_category').notNullable()
    table.text('tags')
    table.string('currency').notNullable()
    table.date('due_date').notNullable()
    table
      .enum('payment_status', [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.PARTIALLY_PAID, PAYMENT_STATUS.FULLY_PAID])
      .notNullable()
    table.string('reference_number').notNullable()
    table
      .integer('project_cost_center')
      .unsigned()
      .nullable()
      .references('project_id')
      .inTable('projects')
      .onDelete('SET NULL')
    table.text('notes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('documents', (table) => {
    table.increments('document_id').notNullable().primary()
    table.integer('booking_id').unsigned().references('booking_id').inTable('bookings').onDelete('CASCADE')
    table.text('file_url').notNullable()
    table.timestamp('uploaded_at').defaultTo(knex.fn.now())
    table.jsonb('metadata')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('currencies', (table) => {
    table.string('currency_code', 10).notNullable().primary()
    table.decimal('exchange_rate', 10, 5).notNullable()
    table.timestamp('last_updated').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('projects')
  await knex.schema.dropTableIfExists('tax_rates')
  await knex.schema.dropTableIfExists('currencies')
  await knex.schema.dropTableIfExists('documents')
  await knex.schema.dropTableIfExists('bookings')
  await knex.schema.dropTableIfExists('billers')
  await knex.schema.dropTableIfExists('accounts')
  await knex.schema.dropTableIfExists('companies')
}
