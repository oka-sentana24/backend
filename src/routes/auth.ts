import { Router } from 'express'
import penggunaSignup from '@/controllers/auth/penggunaSignup'
import adminSignup from '@/controllers/auth/adminSignup'
import signin from '@/controllers/auth/signin'

const router = Router()

router
  .post('/signin', signin)
  .post('/signup/pengguna', penggunaSignup)
  .post('/signup/admin', adminSignup)

export default router
