import type { HttpContext } from '@adonisjs/core/http'
import JadwalTayang from '#models/jadwal_tayang'
import Genre from '#models/genre'
import Tiket from '#models/tiket'
import { DateTime } from 'luxon'

export default class PagesController {
  /**
   * Menampilkan halaman utama (dashboard) dengan jadwal film.
   */
  async home({ view, request }: HttpContext) {
    const selectedDate = request.input('selectedDate', DateTime.now().toISODate())
    const selectedGenre = request.input('selectedGenre', '')

    const jadwalQuery = JadwalTayang.query()
      .where('tanggal', selectedDate)
      .preload('film', (filmQuery) => {
        filmQuery.preload('genre')
      })
      .preload('studio')
      .preload('tikets')

    if (selectedGenre) {
      jadwalQuery.whereHas('film', (filmQuery) => {
        filmQuery.where('genre_id', selectedGenre)
      })
    }
    
    const jadwals = await jadwalQuery.orderBy('jam', 'asc')

    const jadwalsByFilm = jadwals.reduce((acc, jadwal) => {
      const filmJudul = jadwal.film.judul
      if (!acc[filmJudul]) {
        acc[filmJudul] = {
          judul: filmJudul,
          jadwals: []
        }
      }
      acc[filmJudul].jadwals.push(jadwal)
      return acc
    }, {})

    const genres = await Genre.all()

    return view.render('pages/dashboard', {
      jadwalsByFilm: Object.values(jadwalsByFilm),
      genres,
      selectedDate,
      selectedGenre,
    })
  }
  
  /**
   * Menangani proses pembelian tiket.
   */
  async buyTicket({ params, auth, response, session }: HttpContext) {
    // KUNCI PERBAIKAN: Tambahkan .preload('film') di sini
    const jadwal = await JadwalTayang.query()
      .where('id', params.id)
      .preload('studio')
      .preload('tikets')
      .preload('film') // <-- Baris ini akan memperbaiki error
      .firstOrFail()

    const user = auth.user!

    if (jadwal.tiketTersedia <= 0) {
      session.flash('error', 'Maaf, tiket untuk jadwal ini sudah habis.')
      return response.redirect().back()
    }

    await Tiket.create({
      jadwalTayangId: jadwal.id,
      userId: user.id,
      harga: 50000,
    })

    session.flash('success', `Tiket untuk film ${jadwal.film.judul} berhasil dibeli!`)
    return response.redirect().back()
  }

  /**
   * Menampilkan halaman riwayat pembelian tiket pengguna.
   */
  async history({ view, auth }: HttpContext) {
    const user = auth.user!
    const tikets = await Tiket.query()
      .where('user_id', user.id)
      .preload('jadwalTayang', (jadwalQuery) => {
        jadwalQuery.preload('film').preload('studio')
      })
      .orderBy('created_at', 'desc')

    return view.render('pages/tickets_history', { tikets })
  }
}
