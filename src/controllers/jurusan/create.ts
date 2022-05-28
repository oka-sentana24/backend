import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Jurusan } from '.prisma/client'
import { throwError } from '@/utils/global'

type Body = {
  id: string
  nama: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { ...data } = req.body as Body

  await res.locals.prisma.jurusan
    .create({
      data: {
        ...data,
      },
      select: {
        id: true,
        nama: true,
      },
    })
    .then((jurusan: Jurusan) => res.status(StatusCodes.CREATED).json(jurusan))
    .catch(() => next(throwError(StatusCodes.BAD_REQUEST)))
}
