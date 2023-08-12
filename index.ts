import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import errorHandle from './middleware/errorHandle'
import router from './route/route'
import http from 'http'

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())


dotenv.config({path:'.env'})
const port = process.env.PORT || 3400

app.use(router)

app.use(errorHandle)
server.listen(port , ()=>{
    console.log(`server is runing at http://localhost:${port}`)
})
