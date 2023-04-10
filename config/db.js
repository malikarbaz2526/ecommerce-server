import mongoose from 'mongoose'
import colors from "colors"
import dotenv from "dotenv"
dotenv.config()

const mongoString = process.env.DATABASE_URL
const connectDB=()=>{mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    // console.log(error.bgRed.white)
})

database.once('connected', () => {
    console.log('Database Connected'.bgGreen.white);
})
}
export default connectDB