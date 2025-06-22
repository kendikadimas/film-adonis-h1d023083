import vine from '@vinejs/vine'

export const jadwalValidator = vine.compile(
  vine.object({
    filmId: vine.number(),
    studioId: vine.number(),
    tanggal: vine.date(),
    jam: vine.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  })
)
