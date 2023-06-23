import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import createProxyMiddleware from 'http-proxy-middleware'
dotenv.config()
const app = express()
app.use(bodyParser.json({limit : '30mb', extended : true}))
app.use(bodyParser.urlencoded({limit : '30mb', extended : true}))
app.use(cors())

import postRoutes from './routes/posts.js'
import userRoutes from './routes/user.js'

const PORT = process.env.PORT 

// export const proxy = (app) => {
//     app.use(
//       '/api',
//       createProxyMiddleware({
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//       })
//     )
//   }

//const CONNECTION_URI = process.env.CONNECTION_URI

const CONNECTION_URI = 'mongodb://127.0.0.1:27017/PepperMint'
mongoose.connect(CONNECTION_URI, {useNewUrlParser : true, useUnifiedTopology : true})
    .then( ()=> app.listen(PORT, ()=> console.log(`Server running on ${PORT}`)))
    .catch((err) => console.log(err.message))

 
app.use('/posts', postRoutes)
app.use('/user', userRoutes)

app.use('/', (req, res)=>{
    res.send("API is Working!!")
}) 