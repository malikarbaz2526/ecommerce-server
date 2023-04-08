import express from "express"
const app = express()
// const mongoose = require('mongoose')
import cors from "cors"
import connectDB from "./config/db.js"
import morgan from "morgan"
import router from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from './routes/productRoutes.js'
app.use(cors())
import dotenv from "dotenv"


 // === WHEN env FILE USE
dotenv.config()


// =============MIDDLEWARE USE WHEN  POST DATA START====

// app.use(express.urlencoded(extended=true))
// middleware use when data post in json formet 
app.use(express.json())
app.use(morgan('dev'))
// fileupload middleware



// Database config
connectDB()

// routes
app.use('/api/v1/auth',router)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)




var port = 5000
app.listen(port, ()=>{
    console.log(`Server Connected ${port}`)
})