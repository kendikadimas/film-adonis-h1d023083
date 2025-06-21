import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Genre from './genre.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Film extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare judul: string

  @column()
  declare sutradara: string
  
  @column()
  declare tahun: number

  @column()
  declare poster: string | null

  @column()
  declare genreId: number

  @belongsTo(() => Genre)
  declare genre: BelongsTo<typeof Genre>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}