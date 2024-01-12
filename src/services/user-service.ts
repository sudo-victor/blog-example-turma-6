import bcrypt from "bcrypt"
import { UserRepository } from "../repositories/user-repository"

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(nickname: string, email: string, password: string) {
    const userAlreadyExists = await this.userRepository.findByNicknameOrEmail(nickname, email)
    if (userAlreadyExists) {
      throw new Error("User already exists")
    }

    const result = await this.userRepository.save(
      nickname,
      email,
      await bcrypt.hash(password, 8),
    )
  
    return result
  }
}