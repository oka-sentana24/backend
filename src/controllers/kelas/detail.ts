import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Kelas } from '.prisma/client'

type Params = {
  id: string
  nama: string
  grade: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const kelas: Kelas = await res.locals.prisma.kelas.findFirst({
    where: { id },
    select: {
      id: true,
      nama: true,
      grade: true
    },
  })

  res.status(StatusCodes.OK).json(kelas)
}
