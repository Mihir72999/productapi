import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import type { BrandProductMap , Post , Products } from '../controller.d'
import path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'
import {collection} from '../hook/prismaCollection'    
import Razorpay from 'razorpay'
import crypto from "crypto" 
import redableFunction from '../hook/redable'


export const getStarterPage = ((req: Request, res: Response) => {
    
    const item = fs.createReadStream('build/prisma.html')
      item.pipe(res)
     
  
 })

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    async function getProduct(str , product){
     console.log(str)
     try{
         const {product} = await product()
           redableFunction(product , 200 , res)
     }catch(err:any){
          redableFunction({err} , 200 , res)
     }

}
const str = 'getProduct'
getProduct(str , async()=>{
 const product = await collection.product
 return {product} 
})
// collection.product
//     .then((products:any)=>redableFunction(products , 200 , res))  
//     .catch((err: any)=>redableFunction({err} , 200 , res))

})
export const getBrandmodel = asyncHandler(async (req: Request, res: Response) => {
     collection.brandModel
        .then((product:any)=>{
            const getItem: BrandProductMap = {};
            for ( let item of product) {
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
            
            redableFunction(getItem , 200 , res)
        })
        .catch((err:any)=>console.log(err))

})

export const postComment = asyncHandler(async (req: Request, res: Response) => {

    const { name, support, item, reactions , type } = req.body
    
    const datas = await collection.createComment({
        data: {
            name,
            reactions,
            item,
            support,
            type
        }
    })
    
    redableFunction(datas , 201 , res)
})


export const updateComment = asyncHandler(async (req: Request, res: Response) => {



    const { id, name, reactions,type, item, support } = req.body
    console.log(reactions, item)
    const items = await collection.updateComment({
        where: { id: id },
        data: {
            name,
            reactions,
            item,
            support,
            type        }
    })
redableFunction({ message: `succesfully ${items.count} updated` } , 203 , res)
})

export const getComment = asyncHandler(async(req:Request,res:Response)=>{
    try{
        const item = await collection.comment
        redableFunction(item , 200 , res)
    }catch(err:any){
      console.log(err)
     redableFunction(err , 401, res)
 }})

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

redableFunction(allPost , 200 , res)
})

export const postContenteById = asyncHandler(async(req:Request,res:Response)=>{
      const getDirectory = (process.cwd(), 'post')
      
      
      const {id} = req.params
      const fullFile = path.join(getDirectory , `${id}.md`)
     
      const data = fs.createReadStream(fullFile)
      data.pipe(res)
})

export const getOrder =  asyncHandler(async(req:Request  , res:Response):Promise<void> =>{
    collection.createOrder({
    data:{
        ...req.body
    }
  })
  .then((order:any)=>redableFunction(order , 200 , res))
  .catch((err:any)=>redableFunction({err}, 401 ,res ))
  })

export const getAllRouteHandler = (req: Request, res: Response) =>  redableFunction({message:'path is not found which is entered by you'} , 404 , res)
  
 

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
      if(order){
          redableFunction({success:true , order}, 201,res)
        }else{
            redableFunction({success:false} , 401 , res)
        }

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

      await collection.callBack({data:{razorpay_payment_id , razorpay_order_id , razorpay_signature}})
      
     res.redirect(301 ,`https://mobapp-blue.vercel.app/redirectrazorpay/page?order_id=${razorpay_order_id}`)
     }else{
       
       redableFunction({sucess:'false'},401 , res)
     }
   
  })
  
