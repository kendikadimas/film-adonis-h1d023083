import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'films'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('judul').notNullable()
      table.string('sutradara').notNullable()
      table.integer('tahun').notNullable()
      table.string('poster').nullable()
      table.integer('genre_id').unsigned().references('id').inTable('genres').onDelete('CASCADE')
      table.timestamps(true, true)

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}