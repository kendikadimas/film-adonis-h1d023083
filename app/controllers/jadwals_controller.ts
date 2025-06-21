import type { HttpContext } from '@adonisjs/core/http'
import JadwalTayang from '#models/jadwal_tayang'
import Film from '#models/film'
import Studio from '#models/studio'
import { jadwalValidator } from '#validators/jadwal'

export default class JadwalsController {
  /**
   * Menampilkan semua jadwal tayang untuk admin.
   */
  async index({ view }: HttpContext) {
    const jadwals = await JadwalTayang.query().preload('film').preload('studio').orderBy('tanggal', 'desc')
    return view.render('pages/admin/jadwal/index', { jadwals })
  }

  /**
   * Menampilkan form untuk membuat jadwal baru.
   */
  async create({ view }: HttpContext) {
    const films = await Film.all()
    const studios = await Studio.all()
    return view.render('pages/admin/jadwal/create', { films, studios })
  }

  /**
   * Menyimpan jadwal baru ke database.
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(jadwalValidator)
    await JadwalTayang.create(payload)

    session.flash({ success: 'Jadwal berhasil ditambahkan.' })
    return response.redirect().toRoute('jadwal.index')
  }

  /**
   * Menampilkan form untuk mengedit jadwal.
   */
  async edit({ params, view }: HttpContext) {
    const jadwal = await JadwalTayang.findOrFail(params.id)
    const films = await Film.all()
    const studios = await Studio.all()
    return view.render('pages/admin/jadwal/edit', { jadwal, films, studios })
  }

  /**
   * Memperbarui data jadwal di database.
   */
  async update({ params, request, response, session }: HttpContext) {
    const jadwal = await JadwalTayang.findOrFail(params.id)
    const payload = await request.validateUsing(jadwalValidator)
    
    jadwal.merge(payload)
    await jadwal.save()

    session.flash({ success: 'Jadwal berhasil diperbarui.' })
    return response.redirect().toRoute('jadwal.index')
  }

  /**
   * Menghapus jadwal dari database.
   */
  async destroy({ params, response, session }: HttpContext) {
    const jadwal = await JadwalTayang.findOrFail(params.id)
    await jadwal.delete()

    session.flash({ success: 'Jadwal berhasil dihapus.' })
    return response.redirect().toRoute('jadwal.index')
  }
}
