import { Router } from "express"
import { Schema, model, SchemaType } from "mongoose"
import * as yup from "yup"
import jwt from "jsonwebtoken"

const PostSchema = new Schema({
  content: { type: String, required: true },
  likeAmount: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

const Post = model("Post", PostSchema)

const postRoutes = Router()

postRoutes.post("/posts", async (request, response) => {
  const { body, headers } = request

  const bodySchema = yup.object({
    content: yup.string().required()
  })

  try {
    await bodySchema.validate(body)
  } catch (err: any) {
    return response.status(400).json({ message: err.errors})
  }

  const token = headers["authorization"]?.replace("Bearer ", "")
  if (!token) {
    return response.status(401).json({ message: "Unauthorized" })
  }

  const data = {
    content: body.content,
    author: (jwt.decode(token) as any).id
  }

  const post = await Post.create(data)

  return response.json({ post })
})

export { postRoutes }
