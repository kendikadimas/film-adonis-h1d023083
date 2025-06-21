import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import JadwalTayang from './jadwal_tayang.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Studio extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaStudio: string

  @column()
  declare kapasitas: number

  // Sebuah studio bisa memiliki banyak jadwal tayang
  @hasMany(() => JadwalTayang)
  declare jadwalTayangs: HasMany<typeof JadwalTayang>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
