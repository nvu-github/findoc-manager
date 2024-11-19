import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('recurring_bookings', (table) => {
    table.increments('recurring_booking_id').unsigned().notNullable().primary()
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
    table.decimal('amount', 15, 2).notNullable()
    table.decimal('tax', 10, 5)
    table.decimal('tax_rate', 10, 5)
    table.text('description')
    table.text('tags')
    table.enum('recurrence_interval', ['daily', 'weekly', 'monthly', 'yearly']).notNullable()
    table.date('next_run_date').notNullable()
    table.boolean('is_active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('recurring_bookings')
}
