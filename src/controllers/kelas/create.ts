import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Kelas } from '.prisma/client'
import { throwError } from '@/utils/global'

type Body = {
  id: string
  nama: string
  grade: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { ...data } = req.body as Body

  await res.locals.prisma.kelas
    .create({
      data: {
        ...data,
      },
      select: {
        id: true,
        nama: true,
        grade: true,
      },
    })
    .then((kelas: Kelas) => res.status(StatusCodes.CREATED).json(kelas))
    .catch(() => next(throwError(StatusCodes.BAD_REQUEST)))
}
