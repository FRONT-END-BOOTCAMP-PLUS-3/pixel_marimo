import { Marimo } from "@prisma/client"

export interface MarimoRepository {
  findAliveMarimo(userId: number): Promise<Marimo | null>
}
