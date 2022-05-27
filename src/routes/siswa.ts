import { Router } from 'express'
import { admin, auth } from '@/utils/middleware'
import create from '@/controllers/siswa/create'

const router = Router()

router.post('/', [auth, admin], create)

export default router
