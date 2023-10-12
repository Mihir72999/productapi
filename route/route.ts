import { Router} from 'express'

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


router.patch('/updateUser' , updatePassword)
router.post('/register',postRegister )
router.use(jwtVerify)
router.get('/',getStarterPage)
router.get('/getProduct',jwtVerify, getProduct)
router.post('/postComment', postComment)    
router.patch('/updateComment', updateComment)
router.get('/getBrandmodel', getBrandmodel)
router.get('/getComment',getComment)
router.get('/postContent' ,postContent)
router.get('/postContent/:id' , postContenteById)
router.post('/login' ,  postLogin )
router.get('/getUser' , getUser)
router.post('/logout' , logOut)
router.post('/order' ,getOrder)
router.post('/paymentCheckout' , paymentCheckout)
router.post('/callback' ,callback)
router.delete('/deleteuser' , deleteAccount)
router.all('*', getAllRouteHandler)


export default router
