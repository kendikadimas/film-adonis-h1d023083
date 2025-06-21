import type { HttpContext } from '@adonisjs/core/http'
import Tiket from '#models/tiket'

export default class TiketsController {
  /**
   * Menampilkan daftar semua tiket yang telah dibeli.
   */
  async index({ view }: HttpContext) {
    const tikets = await Tiket.query()
      .preload('user')
      .preload('jadwalTayang', (query) => {
        query.preload('film').preload('studio')
      })
      .orderBy('created_at', 'desc')

    return view.render('pages/admin/tickets/index', { tikets })
  }

  /**
   * Menghapus/membatalkan tiket.
   */
  async destroy({ params, response, session }: HttpContext) {
    const tiket = await Tiket.findOrFail(params.id)
    await tiket.delete()

    session.flash({ success: 'Tiket berhasil dibatalkan/dihapus.' })
    return response.redirect().back()
  }
}
