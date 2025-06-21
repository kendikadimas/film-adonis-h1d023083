import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import Film from './film.js'
import Studio from './studio.js'
import Tiket from './tiket.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class JadwalTayang extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare filmId: number

  @column()
  declare studioId: number
  
  @column()
  declare tanggal: string

  @column()
  declare jam: string

  @belongsTo(() => Film)
  declare film: BelongsTo<typeof Film>

  @belongsTo(() => Studio)
  declare studio: BelongsTo<typeof Studio>

  @hasMany(() => Tiket)
  declare tikets: HasMany<typeof Tiket>

  @computed()
  get tiketTersedia() {
    if (!this.studio || !this.tikets) return 0
    return this.studio.kapasitas - this.tikets.length
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}