import { Schema, model } from "mongoose"
import { Router } from "express"
import bcrypt from "bcrypt"
import * as yup from "yup"
import { sign, verify } from "jsonwebtoken"

const UserSchema = new Schema({
  nickname: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, minLength: 6 }
}, { timestamps: true })

const User = model("User", UserSchema)

const userRoutes = Router()

userRoutes.post("/users", async (request, response) => {
  const { body } = request;

  // yup -> vai validar as infos que o cliente nos passa, por exemplo: body, params, headers ou query

  // schema -> um objeto que define como a gente espera o body
  const createUserBodySchema = yup.object({
    nickname: yup.string().required("Nickname é obrigatorio"),
    email: yup.string().email().required(),
    password: yup.string().min(6, "A senha tem que ter pelo menos 6 caracteres").required("Senha é obrigatório"),
  })

  // validate -> validar se o body respeita os padroes do schema
  try {
    await createUserBodySchema.validate(body)
  } catch (err: any) {
    return response.status(400).json({ message: err.errors })
  }

  const userAlreadyExists = await User.findOne({
    $or: [{ nickname: body.nickname }, { email: body.email }]
  })
  if (userAlreadyExists) {
    return response.status(404).json({ message: "User already exists" })
  }

  const result = await User.create({
    nickname: body.nickname,
    email: body.email,
    password: await bcrypt.hash(body.password, 8)
  })
  
  return response.status(201).json(result)
})

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
  const user = await User.findOne({ email: body.email })
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
  } catch(err) {
    return response.status(401).json({ message: "Unauthorized" })
  }

  next()
}, async (request, response) => {
  const users = await User.find()
  return response.json({ users })
})

export { userRoutes }