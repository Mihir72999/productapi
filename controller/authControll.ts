import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import {collection} from '../hook/prismaCollection'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt  from 'bcrypt'
import redableFunction from '../hook/redable'

export const postRegister = asyncHandler(async(req:Request,res:Response)=>{

    const {userName , email ,password , image} = req.body
    const salt = 10
    const generatePassword = bcrypt.hashSync(password,salt)
    const foundUser = await collection.findUser({where:{email}})
   
    if(foundUser?.email){
      redableFunction({message:'user already register'}, 422 , res)
     return
    } 
    else if(!userName || !email || !password){
      redableFunction({message:'missing credintial field please fill proper'} , 401 , res)
      return
    }

    const item = await collection.createUser({
        data:{
            userName,
            email,
            password:generatePassword ,
            image
        }
    })
    
       redableFunction(item , 200 , res)
    
  })

  export const postLogin = asyncHandler(async(req:Request ,res:Response):Promise<void>=>{
    const {email , password } = req.body
    console.log(req.url)
     const user = await collection.findUser({where:{email}})
     const pass :string | undefined | any = user?.password ?? ""
     
      const pas = bcrypt.compare(password, pass)
      
      if(!user || !pas){
        redableFunction({message:'invalid cradintial'}, 401 , res)
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
    //  const refreshToken  = jwt.sign({
    //   "username": user.userName 
    //  },
    //  `${jwtSecret}` ,
    //  {expiresIn :'1d'}
    //   )
      res.cookie('jwt' , accessToken , {
      httpOnly:true,
      secure:true,
      sameSite:'none',   
      maxAge:24 * 60 * 60 * 1000})
     
   
   
    redableFunction({accessToken} , 200 , res)
  
  })

  export const getUser = async(req:Request , res:Response)=>{
    const token = req.cookies.jwt
      try {
    const decoded = jwt.verify(token, `${process.env.JWT_TOKEN}`) as JwtPayload;
    const user = await collection.findUser({ where: { userName: decoded?.userInfo?.username } });
    if (!user) {
      return  redableFunction({ message: 'user not found' } , 401 , res);
    }
    redableFunction(user , 200 , res);
  } catch (error) {
    redableFunction({ message: 'forbidden'} , 403 , res);
   }   }


 export const deleteAccount = asyncHandler(async (req:Request , res:Response)=>{
  const {id} = req.body
 
  const user = await collection.findUser({where:{id}})
  if(user){
     await collection.deleteUser({where:{id}})
     res.clearCookie('jwt', {httpOnly:true,
      secure:true,
      sameSite:'none'})
  redableFunction(`${user?.userName} your account has been deleted`,200 , res)
  }else{
    redableFunction({message:'user not found'},401 ,res)
  }
 })  
export const updatePassword = asyncHandler(async(req:Request , res:Response)=>{
  const {email , password} = req.body
  const salt = 10
  const generatePassword = bcrypt.hashSync(password,salt)
  const user = await collection.findUser({where:{email}})

  if(user){ 
    await collection.updateUser({
      where:{email},
      data:{
        password:generatePassword
      }
    })
    
   redableFunction({message:`${user.userName} has been updated password` , user},200 , res)
  }else{
    redableFunction({message:'user not found'},401,res)
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
    redableFunction({message:'cookie cleared'},200 , res)
   })

  

