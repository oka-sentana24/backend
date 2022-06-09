import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Kelas } from '.prisma/client'

type Params = {
  id: string
}
type Body = {
  nama:string
  grade:string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params
  const { ...data } = req.body as Body

  const kelas: Kelas = await res.locals.prisma.kelas.update({
    where: { id },
    data: {
      ...data,
    },
    select: {
      id: true,
      nama: true,
      grade:true
    },
  })

  res.status(StatusCodes.OK).json(kelas)
}
