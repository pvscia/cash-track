import express from 'express'
import cors from "cors";
import pool from "./db.js"; 
import authRoutes from './routes/authRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import moneyAccountsRoutes from './routes/moneyAccountsRoutes.js'
import targetsRoutes from './routes/targetsRoutes.js'
import transactionsRoutes from './routes/transactionsRoutes.js'
import middleware from './middleware/middleware.js'

const PORT = process.env.PORT || 5003
const app = express()
app.use(cors());
app.use(express.json());

//Routes
app.use('/auth',authRoutes)
app.use('/categoriesRoutes',middleware,categoriesRoutes)
app.use('/moneyAccountsRoutes',middleware,moneyAccountsRoutes)
app.use('/targetsRoutes',middleware,targetsRoutes)
app.use('/transactionsRoutes',middleware,transactionsRoutes)

app.get('/',((req,res)=>{
    res.sendStatus(200)
}))



app.listen(PORT,()=>{
    console.log(`Server started at http://localhost:${PORT}`)
})