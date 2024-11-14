import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'nvu1245',
    database: 'findoc-db'
  }
});

export default db;
