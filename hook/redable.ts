import { Readable } from "stream"
import {Response} from "express";


const redableFunction = (data:string | {} , status:number , res:Response):void=>{

 const redable = new Readable({
  objectMode:true,
  read(){}  
})
redable.on('data',(datas)=>{
  res.status(status).json(datas)  
})

redable.push(data)
}

export default redableFunction