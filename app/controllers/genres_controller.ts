import type { HttpContext } from '@adonisjs/core/http'
import Genre from '#models/genre'
import { genreValidator } from '#validators/genre'

export default class GenresController {
  /**
   * Menampilkan daftar semua genre.
   */
  async index({ view }: HttpContext) {
    const genres = await Genre.query().orderBy('namaGenre', 'asc')
    return view.render('pages/admin/genres/index', { genres })
  }

  /**
   * Menampilkan form untuk membuat genre baru.
   */
  async create({ view }: HttpContext) {
    return view.render('pages/admin/genres/create')
  }

  /**
   * Menyimpan genre baru ke database.
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(genreValidator)
    await Genre.create(payload)
    session.flash('success', 'Genre baru berhasil ditambahkan.')
    return response.redirect().toRoute('genres.index')
  }

  /**
   * Menampilkan form untuk mengedit genre.
   */
  async edit({ params, view }: HttpContext) {
    const genre = await Genre.findOrFail(params.id)
    return view.render('pages/admin/genres/edit', { genre })
  }

  /**
   * Memperbarui data genre di database.
   */
  async update({ params, request, response, session }: HttpContext) {
    const genre = await Genre.findOrFail(params.id)
    // Beri tahu validator ID mana yang harus diabaikan saat pengecekan unique
    const payload = await request.validateUsing(genreValidator, {
      meta: {
        id: genre.id
      }
    })
    
    genre.merge(payload)
    await genre.save()
    session.flash('success', 'Genre berhasil diperbarui.')
    return response.redirect().toRoute('genres.index')
  }

  /**
   * Menghapus genre dari database.
   */
  async destroy({ params, response, session }: HttpContext) {
    const genre = await Genre.findOrFail(params.id)
    await genre.delete()
    session.flash('success', 'Genre berhasil dihapus.')
    return response.redirect().back()
  }
}
