import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Pengguna, Siswa, Kelas, Jurusan } from '.prisma/client'
import { getPassword, getToken } from '@/utils/auth'
import { throwError } from '@/utils/global'
import { User } from '@/types/global'
import { Role } from '@/types/enums'

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
  kelasId: string
  jurusanId: string
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id, password, username, kelasId, jurusanId, ...data } =
    req.body as Body

  const hashedPassword = await getPassword(username)

  await res.locals.prisma.kelas.findFirst({
    where: {
      id: kelasId,
    },
  })
  await res.locals.prisma.jurusan.findFirst({
    where: {
      id: jurusanId,
    },
  })

  await res.locals.prisma.siswa
    .create({
      data: {
        username,
        ...data,
        kelasId: id,
        pengguna: {
          create: {
            username: username,
            password: hashedPassword,
          },
        },
        kelas: {
          connect: {
            id: kelasId,
          },
        },
        jurusan: {
          connect: {
            id: jurusanId,
          },
        },
      },
      select: {
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
      },
    })
    .then(
      (siswa: Siswa) => res.status(StatusCodes.CREATED).json(siswa),
      (kelas: Kelas) => res.status(StatusCodes.CREATED).json(kelas),
      (jurusan: Jurusan) => res.status(StatusCodes.CREATED).json(jurusan),
      (pengguna: Pengguna) => {
        const user: User = {
          ...pengguna,
          role: Role.PENGGUNA,
        }
        const token: string = getToken(user)
        res.status(StatusCodes.CREATED).json({ user, token })
      }
    )
    .catch(() => next(throwError(StatusCodes.BAD_REQUEST)))
}
