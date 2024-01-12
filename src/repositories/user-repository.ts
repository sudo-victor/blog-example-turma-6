import { UserModel } from "../entities/user";

export class UserRepository {
  async findByNicknameOrEmail(nickname: string, email: string) {
    return await UserModel.findOne({
      $or: [{ nickname: nickname }, { email: email }]
    })
  }

  async save(nickname: string, email: string, password: string) {
    return await UserModel.create({
      nickname: nickname,
      email: email,
      password: password
    })
  }
}