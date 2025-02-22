import { User } from "@marimo/domain/entities/User"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: number): Promise<User | null>
}
