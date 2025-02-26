import { Marimo } from "@prisma/client"

export interface MarimoRepository {
  findAliveMarimos(userId: number): Promise<Marimo | null>
}
