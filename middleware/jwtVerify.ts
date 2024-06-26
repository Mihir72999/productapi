import { NextFunction, Request , Response } from "express"
import jwt from 'jsonwebtoken'
interface DecodedUserInfo {
    userInfo : UserInfo
    // Add other properties as needed
}
type UserInfo = {
    username: string;
    userEmail: string;
    }
declare global {
    namespace Express {
        interface Request {
      
             user?: string; // Adjust the type as needed
             email?: string; // Adjust the type as needed
        }
    }
}

 const jwtVerify = (req:Request  , res:Response , next:NextFunction)=>{
     const authHeader : string | undefined = req.headers.authorization?.toString()! || req.headers.Authorization?.toString()! 
    const token =authHeader?.split(' ')[1]
   
    if(authHeader?.startsWith('Bearer ') ) {
    const tokens : jwt.JwtPayload = jwt.verify(token,
        `${process.env.JWT_TOKEN}`,
        ) as  DecodedUserInfo    
           req.user = tokens.userInfo.username  
           req.email = tokens.userInfo.userEmail  
           next()
        }else{
            next({message:'user forbidden'})
        }
    } 
  
   
     
  
 
export default jwtVerify
