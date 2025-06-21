import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import type { Opaque } from '@adonisjs/core/types/helpers'

export type Password = Opaque<'Password', string>

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: Password

  @column()
  declare isAdmin: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Hook untuk hashing password sebelum disimpan.
   */
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  /**
   * KUNCI PERBAIKAN: Method ini digunakan oleh sistem Auth
   * untuk memverifikasi password saat login.
   */
  static async verifyCredentials(email: string, password: Password) {
    const user = await this.findBy('email', email)
    if (!user) {
      return null
    }

    if (await hash.verify(user.password, password)) {
      return user
    }

    return null
  }
}
