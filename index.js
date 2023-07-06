import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(bodyParser.json({limit : '30mb', extended : true}))
app.use(bodyParser.urlencoded({limit : '30mb', extended : true}))
app.use(cors())

import postRoutes from './routes/posts.js'
import userRoutes from './routes/user.js'
import { post } from './routes/posts.js'

const PORT = process.env.PORT 
//const CONNECTION_URI = 'mongodb://127.0.0.1:27017/PepperMint'
const CONNECTION_URI = process.env.CONNECTION_URI
mongoose.connect(CONNECTION_URI, {useNewUrlParser : true, useUnifiedTopology : true})
    .then( ()=> app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)))
    .catch((err) => console.log(err.message))

 
app.use('/posts', postRoutes)
app.use('/post', post)
app.use('/user', userRoutes)

app.use('/home', (req, res)=>{
    res.sendFile(process.cwd() + '/index.html')
}) 