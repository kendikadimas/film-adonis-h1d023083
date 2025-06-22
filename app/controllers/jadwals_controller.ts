import type { HttpContext } from '@adonisjs/core/http'
import JadwalTayang from '#models/jadwal_tayang'
import Film from '#models/film'
import Studio from '#models/studio'
import db from '@adonisjs/lucid/services/db'
import { jadwalValidator } from '#validators/jadwal'

export default class JadwalsController {
  async index({ view }: HttpContext) {
    const jadwals = await JadwalTayang.query()
      .preload('film')
      .preload('studio')
      .orderBy('tanggal', 'desc')

    return view.render('pages/admin/jadwal/index', { jadwals })
  }

  async create({ view }: HttpContext) {
    const films = await Film.all()
    const studios = await Studio.all()
    return view.render('pages/admin/jadwal/create', { films, studios })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(jadwalValidator)

    // Validasi manual tambahan
    const film = await db.from('films').where('id', payload.filmId).first()
    if (!film) {
      session.flash('error', 'Film yang dipilih tidak ditemukan.')
      return response.redirect().back()
    }

    const studio = await db.from('studios').where('id', payload.studioId).first()
    if (!studio) {
      session.flash('error', 'Studio yang dipilih tidak ditemukan.')
      return response.redirect().back()
    }

    const existing = await db
      .from('jadwal_tayangs')
      .where('studio_id', payload.studioId)
      .where('tanggal', payload.tanggal)
      .where('jam', payload.jam)
      .first()

    if (existing) {
      session.flash('error', 'Jadwal untuk kombinasi studio, tanggal, dan jam sudah ada.')
      return response.redirect().back()
    }

    await JadwalTayang.create(payload)
    session.flash('success', 'Jadwal berhasil ditambahkan.')
    return response.redirect().toRoute('jadwal.index')
  }

  async edit({ params, view }: HttpContext) {
    const jadwal = await JadwalTayang.findOrFail(params.id)
    const films = await Film.all()
    const studios = await Studio.all()
    return view.render('pages/admin/jadwal/edit', { jadwal, films, studios })
  }

  async update({ params, request, response, session }: HttpContext) {
    const jadwal = await JadwalTayang.findOrFail(params.id)

    const payload = await request.validateUsing(jadwalValidator)

    const film = await db.from('films').where('id', payload.filmId).first()
    if (!film) {
      session.flash('error', 'Film tidak ditemukan.')
      return response.redirect().back()
    }

    const studio = await db.from('studios').where('id', payload.studioId).first()
    if (!studio) {
      session.flash('error', 'Studio tidak ditemukan.')
      return response.redirect().back()
    }

    const existing = await db
      .from('jadwal_tayangs')
      .where('studio_id', payload.studioId)
      .where('tanggal', payload.tanggal)
      .where('jam', payload.jam)
      .whereNot('id', jadwal.id) // Abaikan dirinya sendiri
      .first()

    if (existing) {
      session.flash('error', 'Jadwal bentrok dengan entri lain.')
      return response.redirect().back()
    }

    jadwal.merge(payload)
    await jadwal.save()

    session.flash('success', 'Jadwal berhasil diperbarui.')
    return response.redirect().toRoute('jadwal.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const jadwal = await JadwalTayang.findOrFail(params.id)
    await jadwal.delete()

    session.flash('success', 'Jadwal berhasil dihapus.')
    return response.redirect().toRoute('jadwal.index')
  }
}
