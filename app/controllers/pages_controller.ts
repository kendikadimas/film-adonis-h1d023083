import type { HttpContext } from '@adonisjs/core/http'
import Film from '#models/film'
import JadwalTayang from '#models/jadwal_tayang'
import Tiket from '#models/tiket'
import Genre from '#models/genre' // Pastikan Genre di-import
import { DateTime } from 'luxon'

export default class PagesController {
  /**
   * Menampilkan halaman utama dengan galeri film yang dapat difilter.
   */
  async home({ view, request }: HttpContext) {
    const selectedDate = request.input('selectedDate', DateTime.now().toISODate())
    const selectedGenre = request.input('selectedGenre')

    // Mulai query untuk Film
    const filmsQuery = Film.query()

    // Terapkan filter genre jika ada
    if (selectedGenre) {
      filmsQuery.where('genre_id', selectedGenre)
    }

    // Terapkan filter tanggal
    // Hanya tampilkan film yang memiliki jadwal tayang pada tanggal yang dipilih
    filmsQuery.whereHas('jadwalTayangs', (jadwalQuery) => {
      jadwalQuery.where('tanggal', selectedDate)
    })

    const films = await filmsQuery.orderBy('created_at', 'desc')
    const genres = await Genre.all()

    return view.render('pages/dashboard', {
      films,
      genres,
      selectedDate,
      selectedGenre,
    })
  }

  /**
   * Menampilkan detail dan jadwal untuk satu film spesifik.
   */
  async showSchedules({ params, view }: HttpContext) {
    const film = await Film.findOrFail(params.id)
    await film.load('genre')

    const jadwals = await JadwalTayang.query()
      .where('film_id', film.id)
      .preload('studio')
      .preload('tikets')
      .orderBy('tanggal', 'asc')
      .orderBy('jam', 'asc')
      .exec()

    return view.render('pages/film_schedules', { film, jadwals })
  }
  
  /**
   * Menangani proses pembelian tiket.
   */
  async buyTicket({ params, auth, response, session }: HttpContext) {
    const jadwal = await JadwalTayang.query()
      .where('id', params.id)
      .preload('studio')
      .preload('film')
      .firstOrFail()

    const user = auth.user!
    
    await jadwal.load('tikets')
    
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
      .exec()

    return view.render('pages/tickets_history', { tikets })
  }
}
