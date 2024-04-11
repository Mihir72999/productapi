import { Router} from 'express'
import {module } from '../hook/module'
import {
    callback,
    getAllRouteHandler,
    getBrandmodel,
    getComment,
    getOrder,
    getProduct, 
    getStarterPage, 
    paymentCheckout, 
    postComment,
    updateComment
    } from '../controller/controller'
import { deleteAccount, getUser, logOut, postLogin, postRegister, updatePassword } from '../controller/authControll'
import jwtVerify from '../middleware/jwtVerify'






const router = Router({ strict: true, caseSensitive: false, mergeParams: true })


 router.get(module['getStarterPage'],getStarterPage)
.post(module['postRegister'],postRegister )
.patch(module['updateUser'] , updatePassword)
.post(module['postLogin'] ,  postLogin );
 
router.use(jwtVerify)
.get(module['getProduct'], getProduct)
.post(module['postComment'], postComment)    
.patch(module['updateComment'], updateComment)
.get(module['getBrandmodel'], getBrandmodel)
.get(module['getComment'],getComment)
.get(module['getUser'] , getUser)
.post(module['logOut'] , logOut)
.post(module['getOrder'] ,getOrder)
.post(module['paymentCheckout'] , paymentCheckout)
.post(module['callback'] ,callback)
.delete(module['deleteAccount'] , deleteAccount)
.all(module['getAllRouteHandler'], getAllRouteHandler)


export default router
