import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import JadwalTayang from './jadwal_tayang.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Tiket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare jadwalTayangId: number

  @column()
  declare userId: number

  @column()
  declare harga: number

  // Sebuah tiket hanya milik satu jadwal tayang
  @belongsTo(() => JadwalTayang)
  declare jadwalTayang: BelongsTo<typeof JadwalTayang>

  // Sebuah tiket hanya milik satu pengguna
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
