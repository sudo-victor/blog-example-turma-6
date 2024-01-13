import { Token } from "./token";
import jwt from "jsonwebtoken"

export class TokenJwt implements Token {
  generate(payload: any) {
    return jwt.sign(payload, "asdasd", { expiresIn: "15min" })
  }
}