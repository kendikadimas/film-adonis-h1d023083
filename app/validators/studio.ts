import vine from '@vinejs/vine'

export const studioValidator = vine.compile(
  vine.object({
    namaStudio: vine.string().trim().minLength(3).unique(async (db, value, field) => {
      const studio = await db
        .from('studios')
        .where('nama_studio', value)
        .whereNot('id', field.meta.id)
        .first()
      return !studio
    }),
    kapasitas: vine.number().min(1),
  })
)
