import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Jurusan } from '.prisma/client'

type Params = {
  id: string
}
type Body = {
  nama:string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params
  const { ...data } = req.body as Body

  const jurusan: Jurusan = await res.locals.prisma.jurusan.update({
    where: { id },
    data: {
      ...data,
    },
    select: {
      id: true,
      nama: true,
    },
  })

  res.status(StatusCodes.OK).json(jurusan)
}
