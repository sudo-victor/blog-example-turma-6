import { Schema, model } from "mongoose"
import { Router } from "express"
import bcrypt from "bcrypt"
import * as yup from "yup"

const UserSchema = new Schema({
  nickname: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, minLength: 6 }
}, { timestamps: true })

const User = model("User", UserSchema)

const userRoutes = Router()

userRoutes.post("/users", async (request, response) => {
  const { body } = request;

  // yup
  // criar um schema para validar um objeto
  const userValidatorSchema = yup.object({
    nickname: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  })

  // vamos validar o objeto
  try {
    await userValidatorSchema.validate(body)
  } catch (error: any) {
    return response.status(400).json({ error: error.errors})
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

export { userRoutes }