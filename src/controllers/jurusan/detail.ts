import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Jurusan } from '.prisma/client'

type Params = {
  id: string
  nama: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const jurusan: Jurusan = await res.locals.prisma.jurusan.findFirst({
    where: { id },
    select: {
      id: true,
      nama: true,
    },
  })

  res.status(StatusCodes.OK).json(jurusan)
}
