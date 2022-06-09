import { Router } from 'express'
import { admin, auth } from '@/utils/middleware'
import create from '@/controllers/siswa/create'
import list from '@/controllers/siswa/list'
import detail from '@/controllers/siswa/detail'
import update from '@/controllers/siswa/update'
import remove from '@/controllers/siswa/remove'

const router = Router()

router
  .post('/', create)
  .get('/list', list)
  .get('/list/:id', detail)
  .put('/update/:id', update)
  .delete('/delete/:id', remove)

export default router
