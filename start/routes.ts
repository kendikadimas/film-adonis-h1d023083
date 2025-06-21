import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Import semua controller
const AuthController = () => import('#controllers/auth_controller')
const PagesController = () => import('#controllers/pages_controller')
const FilmsController = () => import('#controllers/films_controller')
const JadwalsController = () => import('#controllers/jadwals_controller')
const GenresController = () => import('#controllers/genres_controller')
const StudiosController = () => import('#controllers/studios_controller')
const TiketsController = () => import('#controllers/tikets_controller') // Tambahkan ini

// ... (Rute Otentikasi tetap sama) ...
router.get('login', [AuthController, 'loginCreate']).as('auth.login.create').use(middleware.guest())
router.post('login', [AuthController, 'loginStore']).as('auth.login.store').use(middleware.guest())
router.get('register', [AuthController, 'registerCreate']).as('auth.register.create').use(middleware.guest())
router.post('register', [AuthController, 'registerStore']).as('auth.register.store').use(middleware.guest())
router.post('logout', [AuthController, 'destroy']).as('auth.logout')


// Rute Aplikasi Utama
router
  .group(() => {
    router.get('/', [PagesController, 'home']).as('dashboard')
    router.get('/riwayat', [PagesController, 'history']).as('tickets.history')
    router.post('/beli-tiket/:id', [PagesController, 'buyTicket']).as('tickets.buy')
    
    // Grup Rute Khusus Admin
    router
      .group(() => {
        router.resource('films', FilmsController)
        router.resource('jadwal', JadwalsController)
        router.resource('genres', GenresController).except(['show'])
        router.resource('studios', StudiosController).except(['show'])

        // --- TAMBAHKAN CRUD TIKET (Hanya Index dan Destroy) ---
        router.resource('tickets', TiketsController).only(['index', 'destroy'])

      })
      .prefix('manage')
      .use(middleware.admin())
  })
  .use(middleware.auth())
