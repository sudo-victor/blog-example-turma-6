import { Hasher } from "../cryptography/hasher"
import { Token } from "../jwt/token"
import { UserRepository } from "../repositories/user-repository"

export class LoginService {
  constructor(
    private userRepository: UserRepository,
    private hasher: Hasher,
    private token: Token
  ) { }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) return "Invalid credentials"
    const passwordIsValid = await this.hasher.compare(password, user.password as string)
    if (!passwordIsValid) return "Invalid credentials"
    const credentials = this.token.generate({ id: user.id, nickname: user.nickname })
    return credentials
  }
}