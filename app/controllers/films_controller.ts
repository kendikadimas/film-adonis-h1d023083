import type { HttpContext } from '@adonisjs/core/http'
import Film from '#models/film'
import Genre from '#models/genre'
import { filmValidator } from '#validators/film'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import fs from 'node:fs'

export default class FilmsController {
  /**
   * Menampilkan daftar semua film.
   */
  async index({ view }: HttpContext) {
    const films = await Film.query().preload('genre').orderBy('created_at', 'desc')
    return view.render('pages/admin/films/index', { films })
  }

  /**
   * Menampilkan form untuk menambah film baru.
   */
  async create({ view }: HttpContext) {
    const genres = await Genre.all()
    return view.render('pages/admin/films/create', { genres })
  }

  /**
   * Menyimpan film baru ke database.
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(filmValidator)
    const posterFile = request.file('poster', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    const film = new Film()
    film.judul = payload.judul
    film.sutradara = payload.sutradara
    film.tahun = payload.tahun
    film.genreId = payload.genreId

    if (posterFile) {
      const fileName = `${cuid()}.${posterFile.extname}`
      await posterFile.move(app.publicPath('uploads'), { name: fileName })
      film.poster = `uploads/${fileName}`
    }

    await film.save()

    session.flash('success', 'Film berhasil ditambahkan.')
    return response.redirect().toRoute('films.index')
  }

  /**
   * Menampilkan form untuk mengedit film.
   */
  async edit({ params, view }: HttpContext) {
    const film = await Film.findOrFail(params.id)
    const genres = await Genre.all()
    return view.render('pages/admin/films/edit', { film, genres })
  }

  /**
   * Memperbarui data film di database.
   */
  async update({ params, request, response, session }: HttpContext) {
    const film = await Film.findOrFail(params.id)
    const payload = await request.validateUsing(filmValidator)
    const posterFile = request.file('poster', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    film.judul = payload.judul
    film.sutradara = payload.sutradara
    film.tahun = payload.tahun
    film.genreId = payload.genreId

    if (posterFile) {
      // Hapus poster lama jika ada
      if (film.poster) {
        fs.unlink(app.publicPath(film.poster), () => {})
      }
      const fileName = `${cuid()}.${posterFile.extname}`
      await posterFile.move(app.publicPath('uploads'), { name: fileName })
      film.poster = `uploads/${fileName}`
    }

    await film.save()

    session.flash('success', 'Film berhasil diperbarui.')
    return response.redirect().toRoute('films.index')
  }

  /**
   * Menghapus film dari database.
   */
  async destroy({ params, response, session }: HttpContext) {
    const film = await Film.findOrFail(params.id)
    
    // Hapus poster dari storage jika ada
    if (film.poster) {
      fs.unlink(app.publicPath(film.poster), () => {})
    }
    
    await film.delete()

    session.flash('success', 'Film berhasil dihapus.')
    return response.redirect().back()
  }
}
