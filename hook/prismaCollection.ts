
import prisma from '../db/connectDb'


class RegisterCollection  {
    register:  any
    findUser: any
    product:  any
    createUser:any
    deleteUser:any
    updateUser:any
    createComment:any
    updateComment:any
    comment:any
    createOrder:any
    callBack:any
    constructor(register:any ){
         
        this.register = register.register.findMany()
        this.createUser = ({data}:any) => register.register.create({data})
        this.findUser = ({where}:any) => register.register.findFirst({where})         
        this.product = register.products.findMany()
        this.deleteUser = ({where}:any) => register.register.delete({where})
        this.updateUser = ({where , data}:any) =>register.register.updateMany({where,data})
        this.createComment = ({data}:any)=>register.comments.create({data})
        this.updateComment = ({where,data}:any)=>register.comments.updateMany({where,data})
        this.comment = register.comments.findMany()
        this.createOrder = ({data}:any) =>register.orders.create({data})
        this.callBack = ({data}:any) =>register.callbacks.create({data}) 
    } 
    } 
    const collection = new RegisterCollection(prisma)
    

    export {collection}
