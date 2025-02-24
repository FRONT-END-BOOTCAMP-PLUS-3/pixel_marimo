import { PrismaClient } from "@prisma/client"
import { User } from "@marimo/domain/entities"
import { UserRepository } from "@marimo/domain/repositories"

export class PgUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const prisma = new PrismaClient()

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user ?? null
  }

  async findById(id: number): Promise<User | null> {
    const prisma = new PrismaClient()

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user ?? null
  }
}
