import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import prisma from '../db/connectDb'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Readable } from 'stream'
import bcrypt  from 'bcrypt'



export const postRegister = asyncHandler(async(req:Request,res:Response)=>{
    const {userName , email ,password} = req.body
    const salt = 10
    const generatePassword = bcrypt.hashSync(password,salt)
    const foundUser = await prisma.register.findFirst({where:{email}})
   
    if(foundUser?.email){
      res.status(422).json({message:'user already register'})
     return
    } 
    else if(!userName || !email || !password){
      res.status(401).json({message:'missing credintial field please fill proper'})
      return
    }

    const item = await prisma.register.create({
        data:{
            userName,
            email,
            password:generatePassword 
        }
    })
    const readable = new  Readable({
        objectMode:true,
        read(){}
       })
       readable.on('data' , (chunk) =>{
     
          res.status(200).json(chunk)
       })
       readable.push(item)
    
  })

  export const postLogin = asyncHandler(async(req:Request ,res:Response):Promise<void>=>{
    const {email , password } = req.body
  
     const user = await prisma.register.findFirst({where:{email}})
     const pass :string | undefined = user?.password ?? ""
     
      const pas = await bcrypt.compare(password ,pass)
      
      if(!user || !pas){
        res.status(401).json({message:'invalid cradintial'})
       return;
      }
     
      const jwtSecret = process.env.JWT_TOKEN
      
     const accessToken = jwt.sign(
      {
        "userInfo":{
          "username":user.userName,
          "userEmail":user.email
        }

    },         
       `${jwtSecret}`,
      {expiresIn:'1d'}
     )
     const refreshToken  = jwt.sign({
      "username": user.userName 
     },
     `${jwtSecret}` ,
     {expiresIn :'1d'}
      )
      res.cookie('jwt' , refreshToken , {
      httpOnly:true,
      secure:true,
      sameSite:'none',        
      // signed:true,
      maxAge:24 * 60 * 60 * 1000})
     
    res.json({accessToken})
  
  })

  export const getUser = async(req:Request , res:Response)=>{
  const token = req.cookies.jwt
  
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_TOKEN}`) as JwtPayload;

    const user = await prisma.register.findFirst({ where: { userName: decoded?.username } ,select:{userName:true , email:true}});
   
    if (!user) {
      return  res.status(401).json({ message: 'user not found' });

    }

    res.json(user);
  } catch (error) {
    
      res.status(403).json({ message: 'forbidden'  });
    
  }

   }
 export const deleteAccount = asyncHandler(async (req:Request , res:Response)=>{
  const {id} = req.body
  const user = await prisma.register.findFirst({where:{id}})
  if(user){
    const data =  await prisma.register.delete({where:{id}})
    
    res.status(200).json(`${user?.userName} your account has been deleted`)

  }else{
    res.status(401).json({message:'user not found'})
  }
 })  
export const updatePassword = asyncHandler(async(req:Request , res:Response)=>{
  const {email , password} = req.body
  const salt = 10
  const generatePassword = bcrypt.hashSync(password,salt)
  const user = await prisma.register.findFirst({where:{email}})

  if(user){
    await prisma.register.updateMany({
      where:{email},
      data:{
        password:generatePassword
      }
    })
    res.status(201).json({message:`${user.userName} has been updated password` , user})
  }else{
    res.status(401).json({message:'user not found'})
  }
})
   export const logOut = asyncHandler(async(req:Request , res:Response)=>{
    const cookie = req.cookies
    if(!cookie.jwt) {
      res.sendStatus(204)
      return
    }
    res.clearCookie('jwt', {httpOnly:true,
    secure:true,
    sameSite:'none'})
   res.json({message:'cookie cleared'}) 
  })

  

