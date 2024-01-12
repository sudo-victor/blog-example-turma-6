import { Schema, model } from "mongoose"

const UserSchema = new Schema({
  nickname: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, minLength: 6 }
}, { timestamps: true })

export const UserModel = model("User", UserSchema)
