// // pages/api/marimo/[userId].ts
// import { NextApiRequest, NextApiResponse } from "next"

// import { PgMarimoRepository } from "@marimo/infrastructure/repositories/pg-marimo-repository"

// import { PrismaClient } from "@prisma/client"

// import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"])
//     res.status(405).end(`Method ${req.method} Not Allowed`)
//     return
//   }

//   // Extract userId from the URL
//   const { userId } = req.query
//   if (!userId) {
//     res.status(400).json({ error: "User ID is required" })
//     return
//   }

//   const prisma = new PrismaClient()
//   const marimoRepository = new PgMarimoRepository(prisma)
//   const marimoUsecase = new MarimoUsecase(marimoRepository)

//   try {
//     const marimoData = await marimoUsecase.ensureActiveMarimo(
//       parseInt(userId as string),
//     )
//     if (marimoData) {
//       res.status(200).json(marimoData)
//     } else {
//       res.status(404).json({
//         error: "No active marimo found, and could not create a default one.",
//       })
//     }
//   } catch (error) {
//     console.error("Failed to handle request:", error)
//     res.status(500).json({ error: "Internal server error" })
//   }
// }

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { PgMarimoRepository } from "@marimo/infrastructure/repositories"

import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"

export async function POST(req, { params }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  // console.log("---------------------------------")
  // console.log(await params.userId)
  // console.log("---------------------------------")

  const params_1 = await params
  const userId = await Number(params_1.userId)

  if (!token)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  const usecase = new MarimoUsecase(new PgMarimoRepository())

  const user = await usecase.ensureActiveMarimo(userId)

  if (!user || user === null)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  return NextResponse.json({ user }, { status: 200 })
}
