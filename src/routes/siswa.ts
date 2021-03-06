import { Router } from 'express'
import { admin, auth } from '@/utils/middleware'
import { create, list, detail, update, remove } from '@/controllers/siswa'

const router = Router()

router
  .post('/', create)
  .get('/list', list)
  .get('/list/:id', detail)
  .put('/update/:id', update)
  .delete('/delete/:id', remove)

export default router
