import { PrismaClient, Marimo } from "@prisma/client"

import { MarimoRepository } from "@marimo/domain/repositories"

const prisma = new PrismaClient()

export class PgMarimoRepository implements MarimoRepository {
  async findAliveMarimos(userId: number): Promise<Marimo | null> {
    try {
      const marimos = await prisma.marimo.findFirst({
        where: {
          userId: userId,
          status: {
            not: "dead",
          },
        },
        include: {
          object: true, // 관련된 object 정보도 함께 가져옵니다.
        },
      })
      return marimos ?? null
    } catch (error) {
      console.error("Error fetching alive marimos:", error)
      throw error
    }
  }
}
