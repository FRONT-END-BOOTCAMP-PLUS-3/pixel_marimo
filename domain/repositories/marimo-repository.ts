import { Marimo } from "@prisma/client"

export interface MarimoRepository {
  findAliveMarimo(userId: number): Promise<Marimo | null>
  updateMarimo(
    id: number,
    marimoData: Omit<Marimo, "createdAt" | "updatedAt">,
  ): Promise<Marimo | null>
}
