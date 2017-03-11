
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('first_name').notNull().defaultTo('');
    table.string('last_name').notNull().defaultTo('');
    table.string('email').unique().notNull();
    table.specificType('hashed_password', 'char(60)').notNull();
    table.timestamps(true, true)
    // knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));");
   });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
