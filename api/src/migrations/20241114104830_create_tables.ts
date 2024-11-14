import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('companies', (table) => {
    table.increments('company_id').unsigned().notNullable().primary()
    table.string('name').notNullable()
    table.text('address')
    table.string('tax_id')
    table.string('default_currency', 10)
  })

  await knex.schema.createTable('accounts', (table) => {
    table.increments('account_id').primary()
    table.integer('company_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table.string('name').notNullable()
    table.text('description')
  })

  await knex.schema.createTable('billers', (table) => {
    table.increments('biller_id').unsigned().primary()
    table.string('name').notNullable()
    table.text('address')
    table.string('tax_id')
    table.string('default_currency', 10)
  })

  await knex.schema.createTable('bookings', (table) => {
    table.increments('booking_id').notNullable().primary()
    table.integer('company_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table.integer('account_id').unsigned().references('account_id').inTable('accounts').onDelete('CASCADE')
    table.integer('biller_id').unsigned().nullable().references('biller_id').inTable('billers').onDelete('SET NULL') // Unsigned, nullable to allow SET NULL
    table.date('date').notNullable()
    table.decimal('amount', 15, 2).notNullable()
    table.string('currency', 10).notNullable()
    table.decimal('exchange_rate', 10, 5)
    table.text('description')
    table.decimal('tax_amount', 15, 2)
    table.string('tag', 50)
    table.date('invoice_date')
    table.date('payment_date')
    table.date('tax_date')
  })

  await knex.schema.createTable('documents', (table) => {
    table.increments('document_id').notNullable().primary()
    table.integer('booking_id').unsigned().references('booking_id').inTable('bookings').onDelete('CASCADE')
    table.text('file_url')
    table.timestamp('uploaded_at').defaultTo(knex.fn.now())
    table.jsonb('metadata')
  })

  await knex.schema.createTable('currencies', (table) => {
    table.string('currency_code', 10).notNullable()
    table.date('date').notNullable()
    table.decimal('exchange_rate', 10, 5).notNullable()
    table.primary(['currency_code', 'date'])
  })

  await knex.schema.createTable('recurring_bookings', (table) => {
    table.increments('recurring_id').notNullable().primary()
    table.integer('company_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table.integer('account_id').unsigned().references('account_id').inTable('accounts').onDelete('CASCADE')
    table.integer('biller_id').unsigned().nullable().references('biller_id').inTable('billers').onDelete('SET NULL')
    table.decimal('amount', 15, 2).notNullable()
    table.string('currency', 10).notNullable()
    table.decimal('exchange_rate', 10, 5)
    table.text('description')
    table.decimal('tax_amount', 15, 2)
    table.string('tag', 50)
    table.date('next_occurrence')
    table.string('frequency', 20)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('recurring_bookings')
  await knex.schema.dropTableIfExists('currencies')
  await knex.schema.dropTableIfExists('documents')
  await knex.schema.dropTableIfExists('bookings')
  await knex.schema.dropTableIfExists('billers')
  await knex.schema.dropTableIfExists('accounts')
  await knex.schema.dropTableIfExists('companies')
}
