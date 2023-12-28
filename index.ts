import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import errorHandle from './middleware/errorHandle'
import router from './route/route'
import http from 'http'
import cookieParser from 'cookie-parser'
import { corsOptions } from './middleware/corOption'

const port = process.env.PORT || 3400
const app = express()
app.use(express.json())
.use(express.urlencoded({extended:true}))
.use(cors(corsOptions))
.use(cookieParser())
.use(express.static('build'))
.use(router)
.use(errorHandle)




const server = http.createServer(app)


    server.listen(port , ()=>{
        console.log(`server is runing at http://localhost:${port}`)
    })
    
 



