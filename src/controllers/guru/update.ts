import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Siswa } from '.prisma/client'

type Params = {
  id: string
}
type Body = {
  username: string
  password: string
  nama: string
  alamat: string
  jenis_kelamin: string
  tempat_lahir: string
  tanggal_lahir: string
  agama: string
  no_tlp: string
  email: string
  kewarganegaraan: string
  kecamatan: string
  kabupaten: string
  nama_ibu: string
  pekerjaan_ibu: string
  kelasId: string
  jurusanId: string
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params
  const { ...data } = req.body as Body

  const siswa: Siswa = await res.locals.prisma.siswa.update({
    where: { id },
    data: {
      ...data,
    },
    select: {
      id: true,
      username: true,
      nama: true,
      alamat: true,
      jenis_kelamin: true,
      tempat_lahir: true,
      tanggal_lahir: true,
      agama: true,
      no_tlp: true,
      email: true,
      kewarganegaraan: true,
      kecamatan: true,
      kabupaten: true,
      nama_ibu: true,
      pekerjaan_ibu: true,
      kelasId: true,
      jurusanId: true,
    },
  })

  res.status(StatusCodes.OK).json(siswa)
}
