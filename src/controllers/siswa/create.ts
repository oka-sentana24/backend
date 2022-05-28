// import { NextFunction, Request, Response } from 'express'
// import { StatusCodes } from 'http-status-codes'
// import { getPassword, getToken } from '@/utils/auth'
// import { User } from '@/types/global'
// import { Role } from '@/types/enums'
// import { Siswa, Pengguna } from '.prisma/client'
// import { throwError } from '@/utils/global'

// type Body = {
//   id: string
//   username: string
//   password: string
//   nama: string
//   alamat: string
//   jenis_kelamin: string
//   tempat_lahir: string
//   tanggal_lahir: string
//   agama: string
//   no_tlp: string
//   email: string
//   kewarganegaraan: string
//   kecamatan: string
//   kabupaten: string
//   nama_ibu: string
//   pekerjaan_ibu: string
// }

// export default async (req: Request, res: Response, next: NextFunction) => {
//   const { id, username, password, ...data } = req.body as Body
//   const hashedPassword = await getPassword(username)
//   try {
//     await res.locals.prisma.siswa
//       .create({
//         data: {
//           username,
//           ...data,
//           create: {
//             pengguna: {
//               username: username,
//               password: hashedPassword,
//             },
//           },
//         },
//       })
//       .then(
//         (siswa: Siswa) => res.status(StatusCodes.CREATED).json(siswa),
//         (pengguna: Pengguna) => {
//           const user: User = {
//             ...pengguna,
//             role: Role.PENGGUNA,
//           }
//           const token: string = getToken(user)
//           res.status(StatusCodes.CREATED).json({ user, token })
//         }
//       )
//   } catch (error) {
//     console.log(error)
//     return res.status(404).send({ error: 'cannot create siswa' })
//   }
// }

import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Pengguna, Siswa, Kelas } from '.prisma/client'
import { getPassword, getToken } from '@/utils/auth'
import { throwError } from '@/utils/global'
import { User } from '@/types/global'
import { Role } from '@/types/enums'
import { kelas } from '@/routes'

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
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { id, password, username, kelasId, ...data } = req.body as Body

  const hashedPassword = await getPassword(username)

  await res.locals.prisma.kelas.findFirst({
    where: {
      id: kelasId,
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
