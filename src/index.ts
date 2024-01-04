import "dotenv/config"
import express from "express"

import { initializeDatabase } from "./configs/connection"
import { userRoutes } from "./user"

initializeDatabase()

const server = express()

server.use(express.json())
server.use(userRoutes)

server.listen(process.env.PORT, () => console.log("Server is running"))