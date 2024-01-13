import { Hasher } from "./hasher";
import bcrypt from "bcrypt"

export class HasherBcrypt implements Hasher {
  async encrypt(value: string) {
    return bcrypt.hash(value, 8)
  }

  async compare(value: string, hashed: string) {
    return bcrypt.compare(value, hashed)
  }
}