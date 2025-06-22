import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Controller imports
const AuthController = () => import('#controllers/auth_controller')
const PagesController = () => import('#controllers/pages_controller')
const FilmsController = () => import('#controllers/films_controller')
const JadwalsController = () => import('#controllers/jadwals_controller')
const GenresController = () => import('#controllers/genres_controller')
const StudiosController = () => import('#controllers/studios_controller')
const TiketsController = () => import('#controllers/tikets_controller')

/*
|--------------------------------------------------------------------------
| RUTE PUBLIK (Belum Login)
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('login', [AuthController, 'loginCreate']).as('auth.login.create')
    router.post('login', [AuthController, 'loginStore']).as('auth.login.store')
    router.get('register', [AuthController, 'registerCreate']).as('auth.register.create')
    router.post('register', [AuthController, 'registerStore']).as('auth.register.store')
  })
  .use([middleware.guest()]) // Gunakan array konsisten

/*
|--------------------------------------------------------------------------
| LOGOUT (Hanya yang sudah login)
|--------------------------------------------------------------------------
*/
router
  .post('logout', [AuthController, 'destroy'])
  .as('auth.logout')
  .use([middleware.auth()]) // Pakai array

/*
|--------------------------------------------------------------------------
| PENGGUNA BIASA (Login dan Bukan Admin)
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', [PagesController, 'home']).as('dashboard')
    router.get('/film/:id', [PagesController, 'showSchedules']).as('films.shows')
    router.get('/riwayat', [PagesController, 'history']).as('tickets.history')
    router.post('/beli-tiket/:id', [PagesController, 'buyTicket']).as('tickets.buy')
  })
  .use([middleware.auth()]) // auth HARUS lebih dulu

/*
|--------------------------------------------------------------------------
| ADMIN (Login dan Admin)
|--------------------------------------------------------------------------
*/
router
  .group(() => {
    router.get('/', async ({ response }) => {
      return response.redirect().toRoute('films.index')
    })

    router.resource('films', FilmsController)
    router.resource('jadwal', JadwalsController)
    router.resource('genres', GenresController).except(['show'])
    router.resource('studios', StudiosController).except(['show'])
    router.resource('tickets', TiketsController).only(['index', 'destroy'])
  })
  .prefix('manage')
  .use([middleware.auth(), middleware.admin()]) // auth HARUS lebih dulu
