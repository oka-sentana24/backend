import { Router } from 'express'
import { admin, auth } from '@/utils/middleware'
import { create,list,detail, update } from '@/controllers/kelas'

const router = Router()

router
.post('/', create)
.get('/list', list)
.get('/list/:id', detail)
.put('/update/:id', update)

export default router
