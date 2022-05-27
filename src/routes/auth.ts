import { Router } from 'express'
import penggunaSignup from '@/controllers/auth/penggunaSignup'

const router = Router()

router.post('/signup/pengguna', penggunaSignup)

export default router
