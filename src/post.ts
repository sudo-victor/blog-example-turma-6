import { Router } from "express"
import { Schema, model, SchemaType } from "mongoose"
import * as yup from "yup"
import jwt from "jsonwebtoken"

const PostSchema = new Schema({
  content: { type: String, required: true },
  likeAmount: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })

const PostModel = model("Post", PostSchema)

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

  const post = await PostModel.create(data)

  return response.json({ post })
})

postRoutes.patch("/posts/like/:postId", async (request, response) => {
  // 1. Deve ser possivel incrementar a quantidade de like de um post, passando: postId
  const { params } = request
  // 2. Validar se existe um post com aquele id
  const post = await PostModel.findById(params.postId)
  if (!post) {
    return response.status(404).json({ message: "Post not found" })
  }
  // 3. Pegar a quantidade atual de like
  // 4. Incrementar o post
  post.likeAmount += 1
  await post.save()
  return response.status(204).json()
})

postRoutes.patch("/posts/deslike/:postId", async (request, response) => {
  const { params } = request

  const post = await PostModel.findById(params.postId)
  if (!post) {
    return response.status(404).json({ message: "Post not found" })
  }

  post.likeAmount = post.likeAmount <= 0 ? 0 : post.likeAmount -  1
  await post.save()
  return response.status(204).json()
})

postRoutes.get("/posts", async (request, response) => {
  const posts = await PostModel.find()
  return response.status(200).json({ posts })
})

export { postRoutes }
