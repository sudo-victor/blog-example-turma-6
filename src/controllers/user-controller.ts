import { Request, Response } from "express";
import { UserService } from "../services/user-service";
import { createUserBodySchema } from "../validators/create-user-body-validator";

export class UserController {
  constructor(private userService: UserService) {}

  async create(request: Request, response: Response) {
    try {
      const { body } = request;
      await createUserBodySchema.validate(body)
      const result = await this.userService.create(body.nickname, body.email, body.password)
      return response.status(201).json(result)
    } catch (err: any) {
      return response.status(400).json({ message: err.errors ?? err.message })
    }
  }
}