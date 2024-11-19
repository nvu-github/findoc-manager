import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('companies', (table) => {
    table.increments('company_id').unsigned().notNullable().primary()
    table.string('name').notNullable()
    table.text('address')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('accounts', (table) => {
    table.increments('account_id').primary()
    table.integer('company_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table.string('name').notNullable()
    table.text('description')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('billers', (table) => {
    table.increments('biller_id').unsigned().primary()
    table.string('name').notNullable()
    table.text('address')
    table.enum('biller_type', ['biller', 'payer', 'recipient'])
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('currencies', (table) => {
    table.increments('currency_id').notNullable().primary()
    table.string('currency_code', 10).notNullable()
    table.date('date').notNullable()
    table.decimal('exchange_rate', 10, 5).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('bookings', (table) => {
    table.increments('booking_id').notNullable().primary()
    table.integer('company_id').unsigned().references('company_id').inTable('companies').onDelete('CASCADE')
    table.integer('account_id').unsigned().references('account_id').inTable('accounts').onDelete('CASCADE')
    table.integer('biller_id').unsigned().nullable().references('biller_id').inTable('billers').onDelete('SET NULL')
    table
      .integer('currency_id')
      .unsigned()
      .nullable()
      .references('currency_id')
      .inTable('currencies')
      .onDelete('SET NULL')
    table.date('date').notNullable()
    table.decimal('amount', 15, 2).notNullable()
    table.decimal('tax', 10, 5)
    table.decimal('tax_rate', 10, 5)
    table.text('description')
    table.text('tags')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('documents', (table) => {
    table.increments('document_id').notNullable().primary()
    table.integer('booking_id').unsigned().references('booking_id').inTable('bookings').onDelete('CASCADE')
    table.text('file_url')
    table.timestamp('uploaded_at').defaultTo(knex.fn.now())
    table.jsonb('metadata')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
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
