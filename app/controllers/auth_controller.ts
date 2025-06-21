import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Menampilkan halaman login.
   */
  async loginCreate({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Menangani proses login.
   */
  async loginStore({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash({ error: 'Email atau password salah.' })
      return response.redirect().back()
    }
  }

  /**
   * Menampilkan halaman register.
   */
  async registerCreate({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  /**
   * Menangani proses pendaftaran pengguna baru.
   */
  async registerStore({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    
    // Buat pengguna baru
    const user = await User.create(payload)

    // Langsung login setelah berhasil register
    await auth.use('web').login(user)

    // Arahkan ke halaman utama
    return response.redirect().toRoute('dashboard')
  }
  
  /**
   * Menangani proses logout.
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login.create')
  }
}
