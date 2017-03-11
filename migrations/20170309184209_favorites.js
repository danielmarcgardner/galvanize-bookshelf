exports.up = function(knex, Promise) {
	return knex.schema.createTable('favorites', (table) => {
    table.increments()
		table.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE').index();
		table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').index();
    table.timestamp("created_at").defaultTo(knex.raw('now()')).notNullable();
		table.timestamp("updated_at").defaultTo(knex.raw('now()')).notNullable();
    // knex.raw("SELECT setval('favroites_id_seq', (SELECT MAX(id) FROM favorites));");
    })
  }

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
