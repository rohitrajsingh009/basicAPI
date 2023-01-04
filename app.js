import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors'
import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT;
//const DATABASE_URL = process.env.DATABASE_URL
const DATABASE_URL = process.env.CONNECTION_STRING

connectDB(DATABASE_URL)
app.use(cors())
app.use(express.json())
//load routes
app.use('/api/user',userRoutes)

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})