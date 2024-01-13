import { Request, Response } from "express";
import { LoginService } from "../services/login-service";
import { signinBodySchema } from "../validators/login-body-validator";

export class LoginController {
  constructor(private service: LoginService) { }
  async login(request: Request, response: Response) {
    try {
      const { body } = request
      await signinBodySchema.validate(body)
      const result = await this.service.login(body.email, body.password)
      return response.status(200).json({ credentials: result })
    } catch (err: any) {
      return response.status(400).json({ message: err.errors })
    }
  }
}