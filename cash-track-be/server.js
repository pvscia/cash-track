import express from 'express'
import cors from "cors";
import pool from "./db.js"; 
import authRoutes from './routes/authRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import walletsRoutes from './routes/walletsRoutes.js'
import targetsRoutes from './routes/targetsRoutes.js'
import transactionsRoutes from './routes/transactionsRoutes.js'
import middleware from './middleware/middleware.js'

const PORT = process.env.PORT_BE || 5003
const app = express()
app.use(cors());
app.use(express.json());

//Routes
app.use('/auth',authRoutes)
app.use('/categories',middleware,categoriesRoutes)
app.use('/wallets',middleware,walletsRoutes)
app.use('/targets',middleware,targetsRoutes)
app.use('/transactions',middleware,transactionsRoutes)

app.get('/',((req,res)=>{
    res.sendStatus(200)
}))



app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})