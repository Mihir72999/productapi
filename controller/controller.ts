import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import prisma from '../db/connectDb'
import type { BrandProductMap , Post , Products } from '../controller.d'
import path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'
import { Readable } from 'stream'
import Razorpay from 'razorpay'
import crypto from "crypto" 


export const getStarterPage = ((req: Request, res: Response) => {
    const item = fs.createReadStream('build/prisma.html')
      item.pipe(res)
     
  
 })

export const getProduct = asyncHandler(async (req: Request, res: Response) => {

    const product : Products  = await prisma.products.findMany()
    const redable = new Readable({
        objectMode:true,
        read(){}
    })
    
    redable.on('data', (chunk)=>{
       
         res.status(200).json(chunk)
       
    })
    redable.push(product)

    

})
export const getBrandmodel = asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.products.findMany()
    
    const getItem: BrandProductMap = {};

    for (let item of product) {
        const brand = item?.brand ?? ""
        if (item?.brand && item.brand in getItem) {
            if (!getItem[brand].brandmodel.includes(item.brandmodel) && item?.availableQty && item.availableQty > 0) {
                getItem[brand].brandmodel.push(item.brandmodel)
            }
        } else {
            getItem[brand] = JSON.parse(JSON.stringify(item))

            if (item?.availableQty && item?.availableQty > 0) {
                getItem[brand].brandmodel = [item.brandmodel]
            }
        }
    }
    const redable = new Readable({
        objectMode:true,
        read(){}
    })
    
    redable.on('data', (chunk)=>{
       
        res.status(200).json(chunk)
       
    })
    redable.push(getItem)
   

})

export const postComment = asyncHandler(async (req: Request, res: Response) => {

    const { name, support, item, reactions , type } = req.body
    console.log(name, support, type, reactions)
    const datas = await prisma.comments.create({
        data: {
            name,
            reactions,
            item,
            support,
            type
        }
    })
    console.log(datas)
    res.status(201).json(datas)
})


export const updateComment = asyncHandler(async (req: Request, res: Response) => {



    const { id, name, reactions,type, item, support } = req.body
    console.log(reactions, item)
    const items = await prisma.comments.updateMany({
        where: { id: id },
        data: {
            name,
            reactions,
            item,
            support,
            type
        }
    })

     res.status(203).json({ message: `succesfully ${items.count} updated` })
})


export const getComment = asyncHandler(async(req:Request,res:Response)=>{
    const item = await prisma.comments.findMany()
    const redable = new Readable({
        objectMode:true,
        read(){}
    })
    
    redable.on('data', (chunk)=>{
       
        res.status(200).json(chunk)
       
    })
    redable.push(item)
})


export const postContent = asyncHandler(async(req:Request,res:Response)=>{
 const postDirectory = path.join(process.cwd() , 'post')
 const  fileNames = fs.readdirSync(postDirectory)
 const allPost = fileNames.map(post=>{
    const id = post.replace(/\.md$/,'')
    const fullPath = path.join(postDirectory, post)
    const fileContent = fs.readFileSync(fullPath, 'utf-8')
   const materResult =matter(fileContent)
   
   
   const data : Post = {
    id ,
    title:materResult.data.title,
    date:materResult.data.date
   }
 
    return data
 })
const redable = new Readable({
    objectMode:true,
    read(){}
})

redable.on('data', (chunk)=>{
   
    res.send(chunk)
})
redable.push(allPost)
})

export const postContenteById = asyncHandler(async(req:Request,res:Response)=>{
      const getDirectory = (process.cwd(), 'post')
      
      
      const {id} = req.params
      const fullFile = path.join(getDirectory , `${id}.md`)
     
      const data = fs.createReadStream(fullFile)
      data.pipe(res)
})


export const getOrder = async (req:Request  , res:Response) =>{
  const order = await prisma.orders.create({
    data:{
        ...req.body
    }
  })

  res.status(200).json(order)
}


export const getAllRouteHandler = ((req: Request, res: Response) => {
    
     
    const readable = new  Readable({
     objectMode:true,
     read(){}
    })
    readable.on('data' , (chunk) =>{
  
       res.json(chunk)
    })
    readable.push({message:'path is not found which is entered by you'})
  })
 
 
  export const paymentCheckout = asyncHandler( async (req:Request , res:Response) =>{
    
    
    var instance  = new Razorpay({
        key_id : process.env.RAZORPAY_API_KEY_ID || '' ,
        key_secret : process.env.RAZORPAY_API_KEY_SECRET || ''
      });
   
      var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR" ,
        receipt: `#${Math.ceil(Math.random() * 1234 * 159)}` ,
    
      };
    
      const order = await instance.orders.create(options)
   
    
      res.status(201).json({sucess:true , order})
  })
  export const callback  = asyncHandler(async (req:Request , res:Response) =>{
    const {razorpay_payment_id , razorpay_order_id , razorpay_signature } = req.body
    let body= razorpay_order_id + "|" + razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_KEY_SECRET ?? '')
                                  .update(body.toString())
                                  .digest('hex');
                                  
  const isAuthanticate = expectedSignature ===  razorpay_signature                            
    if(isAuthanticate){
    const {razorpay_payment_id , razorpay_order_id , razorpay_signature } = req.body

      await prisma.callbacks.create({data:{razorpay_payment_id , razorpay_order_id , razorpay_signature}})
      
     res.redirect(`https://mobapp-blue.vercel.app/redirectrazorpay/page?order_id=${razorpay_order_id}`)
     }else{
       
       res.status(401).json({sucess:'false'})
     }
  })
  
