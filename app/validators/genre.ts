import vine from '@vinejs/vine'

export const genreValidator = vine.compile(
  vine.object({
    namaGenre: vine.string().trim().minLength(3).unique(async (db, value, field) => {
      // Aturan unique ini memastikan tidak ada nama genre yang sama.
      // Aturan ini juga akan mengabaikan ID saat ini pada proses update.
      const genre = await db
        .from('genres')
        .where('nama_genre', value)
        .whereNot('id', field.meta.id) 
        .first()
      return !genre
    }),
  })
)
