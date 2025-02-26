import { PrismaClient, Marimo } from "@prisma/client"

import { MarimoRepository } from "@marimo/domain/repositories"

export class MarimoUsecase {
  private prisma: PrismaClient

  constructor(private marimoRepository: MarimoRepository) {
    this.prisma = new PrismaClient()
  }

  async ensureActiveMarimo(userId: number): Promise<Marimo | null> {
    try {
      const marimos = await this.marimoRepository.findAliveMarimos(userId)

      // Check if all marimos are "dead"
      if (
        marimos?.length === 0 ||
        marimos?.every((marimo) => marimo.status === "dead")
      ) {
        // Create a default Marimo if all are dead
        return await this.createDefaultMarimo(userId)
      }

      // Return the first alive marimo found (as an example)
      return marimos?.find((marimo) => marimo.status !== "dead") || null
    } catch (error) {
      console.error("Error ensuring active Marimo:", error)
      throw error
    }
  }

  private async createDefaultMarimo(userId: number): Promise<Marimo> {
    const defaultMarimo = {
      userId: userId,
      size: 100, // Default size
      rect: JSON.stringify({ x: 0, y: 0 }), // Default position
      color: "dark_green", // Default color
      status: "angry", // Default status
    }

    return await this.prisma.marimo.create({
      data: defaultMarimo,
    })
  }
}
