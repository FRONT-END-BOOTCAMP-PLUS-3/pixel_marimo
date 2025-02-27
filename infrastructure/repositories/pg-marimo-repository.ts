import { PrismaClient, Marimo } from "@prisma/client"
import { MarimoRepository } from "@marimo/domain/repositories"
import { InputJsonValue } from "@prisma/client/runtime/client"

const prisma = new PrismaClient()

export class PgMarimoRepository implements MarimoRepository {
  async findAliveMarimo(userId: number): Promise<Marimo | null> {
    try {
      const AliveMarimo = await prisma.marimo.findFirst({
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
      console.log("내가 찾은 AliveMairmo 는", AliveMarimo)
      return AliveMarimo
    } catch (error) {
      console.error("Error fetching alive marimos:", error)
      throw error
    }
  }

  async updateMarimo(
    id: number,
    marimoData: Omit<Marimo, "createdAt" | "updatedAt"> & {
      rect?: InputJsonValue
    },
  ) {
    try {
      const updatedMarimo = await prisma.marimo.update({
        where: { id: id },
        data: marimoData,
      })
      return updatedMarimo
    } catch (error) {
      console.error("Error updating marimo data:", error)
      throw error
    }
  }
}
