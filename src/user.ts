import { Router } from "express"
import bcrypt from "bcrypt"
import * as yup from "yup"
import { sign, verify } from "jsonwebtoken"
import { UserModel } from "./entities/user"
import { UserRepository } from "./repositories/user-repository"
import { UserService } from "./services/user-service"
import { UserController } from "./controllers/user-controller"

const userRoutes = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

userRoutes.post("/users", userController.create.bind(userController))
// userRoutes.post("/users", async (req, res) => {
//   return userController.create(req, res)
// })

userRoutes.post("/users/signin", async (request, response) => {
  // 1. Deve ser informado o email e a senha
  const { body } = request

  const signinBodySchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })

  try {
    await signinBodySchema.validate(body)
  } catch (err: any) {
    return response.status(400).json({ message: err.errors })
  }

  // 2. Nao deve logar caso o email nao exista
  const user = await UserModel.findOne({ email: body.email })
  if (!user) {
    return response.status(400).json({ message: "Invalid credentials" })
  }

  // 3. Nao deve logar caso a senha esteja incorreta
  const passwordIsValid = await bcrypt.compare(body.password, user.password as string)
  if (!passwordIsValid) {
    return response.status(400).json({ message: "Invalid credentials" })
  }

  // 4. Deve retornar a credencial caso esteja tudo certo
  // 1 -> payload
  const payload = { id: user.id, nickname: user.nickname }
  // 2 -> assinatura
  const secretKey = "jefghkfjd[;whiortuoegjrwefkqldw;qfkegjroitwd;qkegjrth"
  // 3 -> options
  const options = { expiresIn: "10m" }

  const token = sign(payload, secretKey, options)

  return response.status(200).json({ token })
})

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
