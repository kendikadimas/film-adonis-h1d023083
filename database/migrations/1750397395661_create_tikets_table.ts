import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tikets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('jadwal_tayang_id').unsigned().references('id').inTable('jadwal_tayangs').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('harga', 10, 2).notNullable()
      table.timestamps(true, true)

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}