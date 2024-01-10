import "dotenv/config"
import express from "express"

import { initializeDatabase } from "./configs/connection"
import { userRoutes } from "./user"
import { postRoutes } from "./post"

initializeDatabase()

const server = express()

server.use(express.json())
server.use(userRoutes)
server.use(postRoutes)

server.listen(process.env.PORT, () => console.log("Server is running"))