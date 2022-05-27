import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Pengguna, Admin } from '.prisma/client'
import { checkPassword, getToken } from '@/utils/auth'
import { getRole, throwError } from '@/utils/global'
import { Role } from '@/types/enums'

type Body = {
  username: string
  password: string
}

type User = {
  id: string
  username: string
  role: Role
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body as Body

  const getPengguna: Pengguna = res.locals.prisma.pengguna.findFirst({
    where: { username },
  })

  const getAdmin: Admin = res.locals.prisma.admin.findFirst({
    where: { username },
  })

  const [pengguna, admin] = await res.locals.prisma.$transaction([
    getPengguna,
    getAdmin,
  ])

  if (!pengguna && !admin) return next(throwError(StatusCodes.NOT_FOUND))

  const user: User = {
    id: pengguna?.id || admin?.id,
    username: pengguna?.username || admin?.username,
    role: getRole(admin, pengguna),
  }

  const passwordMatch = await checkPassword(
    password,
    pengguna?.password || admin?.password
  )

  if (!passwordMatch) return next(throwError(StatusCodes.UNAUTHORIZED))

  const token: string = getToken(user)

  res.status(StatusCodes.OK).json({ user, token })
}
