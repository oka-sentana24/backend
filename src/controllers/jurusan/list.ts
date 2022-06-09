import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Jurusan } from '.prisma/client'

type Params = {
  id: string
  
}

export default async (req: Request, res: Response) => {
  const { id } = req.params as Params

  const jurusan: Jurusan = await res.locals.prisma.jurusan.findMany({
    where: { id },

    // select: {
    //   id: true,
    //   username: true,
    //   nama: true,
    //   alamat: true,
    //   jenis_kelamin: true,
    //   tempat_lahir: true,
    //   tanggal_lahir: true,
    //   agama: true,
    //   no_tlp: true,
    //   email: true,
    //   kewarganegaraan: true,
    //   kecamatan: true,
    //   kabupaten: true,
    //   nama_ibu: true,
    //   pekerjaan_ibu: true,
    //   kelasId: true,
    //   jurusanId: true,
    // },
  })

  res.status(StatusCodes.OK).json(jurusan)
}
