import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Pengguna } from '.prisma/client'
import { getPassword, getToken } from '@/utils/auth'
import { throwError } from '@/utils/global'
import { User } from '@/types/global'
import { Role } from '@/types/enums'

type Body = {
  id: string
  username: string
  password: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { password, username } = req.body as Body

  const hashedPassword = await getPassword(username)

  await res.locals.prisma.pengguna
    .create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    })
    .then((pengguna: Pengguna) => {
      const user: User = {
        ...pengguna,
        role: Role.PENGGUNA,
      }

      const token: string = getToken(user)

      res.status(StatusCodes.CREATED).json({ user, token })
    })
    .catch(() => next(throwError(StatusCodes.BAD_REQUEST)))
}
