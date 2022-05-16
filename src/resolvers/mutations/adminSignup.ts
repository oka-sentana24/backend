import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Admin } from '.prisma/client'

import { getPassword, getToken } from '@/utils/auth'
import { throwError } from '@/utils/global'
import { User } from '@/types/global'
import { Role } from '@/types/enums'

type Body = {
  name: string
  username: string
  password: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { password, ...data } = req.body as Body

  const hashedPassword = await getPassword(password)

  await res.locals.prisma.admin
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
    .then((admin: Admin) => {
      const user: User = {
        ...admin,
        role: Role.ADMIN,
      }

      const token: string = getToken(user)

      res.status(StatusCodes.OK).json({ user, token })
    })
    .catch(() => next(throwError(StatusCodes.BAD_REQUEST)))
}
