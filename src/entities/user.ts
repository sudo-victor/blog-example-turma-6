import { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
  nickname: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  nickname: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, minLength: 6 }
}, { timestamps: true })

export const UserModel = model("User", UserSchema)
