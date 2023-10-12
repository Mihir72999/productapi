import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import errorHandle from './middleware/errorHandle'
import router from './route/route'
import http from 'http'
import cookieParser from 'cookie-parser'
import { corsOptions } from './middleware/corOption'
import cluster from 'cluster'
import os from 'os'

const numCPUs = os.cpus().length

dotenv.config({path:'.env'})

if(cluster.isPrimary){ 
    for( let i = 0 ; i < numCPUs; i ++){
        cluster.fork()
        cluster.fork()
        
    }
    cluster.on('exit' , ()=>{
        cluster.fork()

    })
}else{

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOptions))
app.use(cookieParser())

const port = process.env.PORT || 3400

app.use(express.static('build'))
app.use(router)


app.use(errorHandle)

    server.listen(port , ()=>{
        console.log(`server is runing at http://localhost:${port}`)
    })
    
 


}
