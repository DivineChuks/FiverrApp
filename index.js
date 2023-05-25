import express from "express"
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js"
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import orderRoute from "./routes/orderRoute.js"
import reviewRoute from "./routes/reviewRoute.js"
import conversationRoute from "./routes/conversationRoute.js"
import messageRoute from "./routes/messageRoute.js"
import gigRoute from "./routes/gigRoute.js"
import errorHandler from "./middleware/error.js"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config()
connectDB()

const app = express()

const PORT = 5000


app.use(cookieParser())
app.use(cors({origin: "http://localhost:3000", credentials: true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/reviews", reviewRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/gigs", gigRoute)
app.use("/api/orders", orderRoute)
app.use("/api/messages", messageRoute)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
} )