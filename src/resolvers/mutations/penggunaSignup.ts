import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Pengguna } from '.prisma/client'
import { getPassword, getToken } from '@/utils/auth'
import { throwError } from '@/utils/global'
import { User } from '@/types/global'
import { Role } from '@/types/enums'

type Body = {
  firstName: string
  lastName: string
  username: string
  password: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { password, ...data } = req.body as Body

  const hashedPassword = await getPassword(password)

  await res.locals.prisma.pengguna
    .create({
      data: {
        ...data,
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
