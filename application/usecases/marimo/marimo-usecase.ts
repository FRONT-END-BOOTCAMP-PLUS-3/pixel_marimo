import { PrismaClient, Marimo } from "@prisma/client"
import { MarimoRepository } from "@marimo/domain/repositories"

export class MarimoUsecase {
  private prisma: PrismaClient

  constructor(private marimoRepository: MarimoRepository) {
    this.prisma = new PrismaClient()
  }

  async ensureAliveMarimo(userId: number): Promise<Marimo | null> {
    try {
      console.log("살아있는 마리모를 찾는 중입니다.")
      const aliveMairmo = await this.marimoRepository.findAliveMarimo(userId)

      // Check if all marimos are "dead"
      if (aliveMairmo === null) {
        // Create a default Marimo if all are dead
        console.log("새 마리모를 만들겠습니다.")
        return await this.createDefaultMarimo(userId)
      }

      return aliveMairmo
    } catch (error) {
      console.error("Error ensuring Alive Marimo:", error)
      throw error
    }
  }

  private async createDefaultMarimo(userId: number): Promise<Marimo> {
    console.log("새 마리모를 만드는 중입니다.")

    const defaultMarimo = {
      userId: userId,
      size: 100, // Default size
      rect: JSON.stringify({ x: 0, y: 0 }), // Default position
      color: "dark_green", // Default color
      status: "angry", // Default status
    }
    console.log("새 마리모를 만들었습니다.")

    return await this.prisma.marimo.create({
      data: defaultMarimo,
    })
  }
}
