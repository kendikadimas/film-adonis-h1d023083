import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Genre from '#models/genre'
import Studio from '#models/studio'

export default class extends BaseSeeder {
  async run() {
    // Hapus user lama jika ada untuk menghindari duplikat email
    await User.query().delete()
    
    // Buat user admin baru.
    // Model User AdonisJS secara otomatis akan men-hash password ini
    // sebelum menyimpannya ke database.
    await User.create({
      fullName: 'Admin',
      email: 'admin@bioskop.com',
      password: 'password', // Passwordnya tetap 'password'
      isAdmin: true,
    })

    // Buat data Genre
    await Genre.createMany([
      { namaGenre: 'Action' },
      { namaGenre: 'Comedy' },
      { namaGenre: 'Horror' },
      { namaGenre: 'Sci-Fi' },
    ])

    // Buat data Studio
    await Studio.createMany([
        { namaStudio: 'Studio 1', kapasitas: 100 },
        { namaStudio: 'Studio 2', kapasitas: 80 },
    ])
  }
}
