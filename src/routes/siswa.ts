import { Router } from 'express'
import { admin, auth } from '@/utils/middleware'
import create from '@/controllers/siswa/create'
import list from '@/controllers/siswa/list'
import detail from '@/controllers/siswa/detail'
import update from '@/controllers/siswa/update'
import remove from '@/controllers/siswa/remove'

const router = Router()

router
  .post('/', [auth, admin], create)
  .get('/list', [auth, admin], list)
  .get('/list/:id', [auth, admin], detail)
  .put('/update/:id', [auth, admin], update)
  .delete('/delete/:id', [auth, admin], remove)

export default router
