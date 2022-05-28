import { Router } from 'express'
import { admin, auth } from '@/utils/middleware'
import create from '@/controllers/kelas/create'

const router = Router()

router.post('/', [auth, admin], create)

export default router
