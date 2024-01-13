import { Router } from "express"

import { verify } from "jsonwebtoken"
import { UserModel } from "./entities/user"
import { UserRepository } from "./repositories/user-repository"
import { UserService } from "./services/user-service"
import { UserController } from "./controllers/user-controller"
import { LoginService } from "./services/login-service"
import { HasherBcrypt } from "./cryptography/hasher-bcrypt"
import { TokenJwt } from "./jwt/token-jwt"
import { LoginController } from "./controllers/login-controller"

const userRoutes = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const hasher = new HasherBcrypt()
const jwt = new TokenJwt()
const loginService = new LoginService(userRepository, hasher, jwt)
const loginController = new LoginController(loginService)
const userController = new UserController(userService)

userRoutes.post("/users", userController.create.bind(userController))
userRoutes.post("/users/signin", loginController.login.bind(loginController))

userRoutes.get("/users", async (request, response, next) => {
  // 1 - Valida se o usuário tem uma credencial
  const { headers } = request
  if (!headers["authorization"]) {
    return response.status(401).json({ message: "Unauthorized" })
  }

  // 2 - Verifico se a credencial é válida
  const token = headers["authorization"].replace("Bearer ", "")

  try {
    const secretKey = "jefghkfjd[;whiortuoegjrwefkqldw;qfkegjroitwd;qkegjrth"
    verify(token, secretKey)
  } catch (err) {
    return response.status(401).json({ message: "Unauthorized" })
  }

  next()
}, async (request, response) => {
  const users = await UserModel.find()
  return response.json({ users })
})

export { userRoutes }
