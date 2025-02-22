import { User } from "@marimo/domain/entities"

export interface AuthRepository {
  signUp(email: string, password: string): Promise<User>
}
