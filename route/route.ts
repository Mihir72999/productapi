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
    postContent, 
    postContenteById,
    updateComment
    } from '../controller/controller'
import { deleteAccount, getUser, logOut, postLogin, postRegister, updatePassword } from '../controller/authControll'
import jwtVerify from '../middleware/jwtVerify'






const router = Router({ strict: true, caseSensitive: false, mergeParams: true })


router.patch(module['updateUser'] , updatePassword)
router.post(module['postRegister'],postRegister )
router.use(jwtVerify)
router.get(module['getStarterPage'],getStarterPage)
router.get(module['getProduct'], getProduct)
router.post(module['postComment'], postComment)    
router.patch(module['updateComment'], updateComment)
router.get(module['getBrandmodel'], getBrandmodel)
router.get(module['getComment'],getComment)
router.get(module['postContent'] ,postContent)
router.get(module['postContenteById'] , postContenteById)
router.post(module['postLogin'] ,  postLogin )
router.get(module['getUser'] , getUser)
router.post(module['logOut'] , logOut)
router.post(module['getOrder'] ,getOrder)
router.post(module['paymentCheckout'] , paymentCheckout)
router.post(module['callback'] ,callback)
router.delete(module['deleteAccount'] , deleteAccount)
router.all(module['getAllRouteHandler'], getAllRouteHandler)


export default router
