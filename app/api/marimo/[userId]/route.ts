import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { PgMarimoRepository } from "@marimo/infrastructure/repositories"
import { MarimoUsecase } from "@marimo/application/usecases/marimo/marimo-usecase"

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const params_1 = await params
  const userId = await Number(params_1.userId)

  if (!token)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  const usecase = new MarimoUsecase(new PgMarimoRepository())
  const user = await usecase.ensureAliveMarimo(userId)

  if (!user || user === null)
    return NextResponse.json({ message: "login failed" }, { status: 401 })

  return NextResponse.json({ user }, { status: 200 })
}
