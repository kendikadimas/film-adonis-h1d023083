import vine from '@vinejs/vine'

/**
 * Validasi untuk data jadwal tayang.
 * Aturan 'unique' memastikan tidak ada jadwal ganda
 * untuk studio, tanggal, dan jam yang sama.
 */
export const jadwalValidator = vine.compile(
  vine.object({
    filmId: vine.number().exists(async (db, value) => {
      const film = await db.from('films').where('id', value).first()
      return !!film
    }),
    studioId: vine.number().exists(async (db, value) => {
      const studio = await db.from('studios').where('id', value).first()
      return !!studio
    }),
    tanggal: vine.date(),
    jam: vine.string().regex(/^\d{2}:\d{2}(:\d{2})?$/), // Format HH:MM atau HH:MM:SS
  })
)

