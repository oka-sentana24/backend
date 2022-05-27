import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getPassword, getToken } from '@/utils/auth'
import { User } from '@/types/global'
import { Role } from '@/types/enums'
import { Siswa, Pengguna } from '.prisma/client'
import { throwError } from '@/utils/global'

type Body = {
  id: string
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
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id, username, password, ...data } = req.body as Body
  const hashedPassword = await getPassword(username)
  await res.locals.prisma.siswa
    .create({
      data: {
        username,
        ...data,
        create: {
          pengguna: {
            username: username,
            password: hashedPassword,
          },
        },
        // Pengguna: {
        //   create: {
        //     username: username,
        //     password: hashedPassword,
        //   },
        // },
      },
    })
    .then(
      (siswa: Siswa) =>
        res
          .status(StatusCodes.CREATED)
          .setHeader('Content-Type', 'application/json')
          .json(siswa),
      (pengguna: Pengguna) => {
        const user: User = {
          ...pengguna,
          role: Role.PENGGUNA,
        }

        const token: string = getToken(user)

        res.status(StatusCodes.CREATED).json({ user, token })
      }
    )
    .catch(
      () => res.status(StatusCodes.BAD_REQUEST).json(null),
      next(throwError(StatusCodes.BAD_REQUEST))
    )
}
