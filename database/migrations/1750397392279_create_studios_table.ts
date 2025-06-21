import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'studios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama_studio').notNullable()
      table.integer('kapasitas').notNullable()
      table.timestamps(true, true)

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}