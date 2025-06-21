import type { HttpContext } from '@adonisjs/core/http'
import Studio from '#models/studio'
import { studioValidator } from '#validators/studio'

export default class StudiosController {
  /**
   * Menampilkan daftar semua studio.
   */
  async index({ view }: HttpContext) {
    const studios = await Studio.query().orderBy('namaStudio', 'asc')
    return view.render('pages/admin/studios/index', { studios })
  }

  /**
   * Menampilkan form untuk membuat studio baru.
   */
  async create({ view }: HttpContext) {
    return view.render('pages/admin/studios/create')
  }

  /**
   * Menyimpan studio baru ke database.
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(studioValidator)
    await Studio.create(payload)
    session.flash('success', 'Studio baru berhasil ditambahkan.')
    return response.redirect().toRoute('studios.index')
  }

  /**
   * Menampilkan form untuk mengedit studio.
   */
  async edit({ params, view }: HttpContext) {
    const studio = await Studio.findOrFail(params.id)
    return view.render('pages/admin/studios/edit', { studio })
  }

  /**
   * Memperbarui data studio di database.
   */
  async update({ params, request, response, session }: HttpContext) {
    const studio = await Studio.findOrFail(params.id)
    const payload = await request.validateUsing(studioValidator, {
      meta: {
        id: studio.id,
      },
    })

    studio.merge(payload)
    await studio.save()
    session.flash('success', 'Studio berhasil diperbarui.')
    return response.redirect().toRoute('studios.index')
  }

  /**
   * Menghapus studio dari database.
   */
  async destroy({ params, response, session }: HttpContext) {
    const studio = await Studio.findOrFail(params.id)
    await studio.delete()
    session.flash('success', 'Studio berhasil dihapus.')
    return response.redirect().back()
  }
}
