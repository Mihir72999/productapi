import { Router, Request, Response } from 'express'
import * as fs from 'fs'

import { getBrandmodel, getComment, getProduct, postComment, updateComment } from '../controller/controller'


const router = Router({ strict: true, caseSensitive: false, mergeParams: true })

router.get('/', (req: Request, res: Response) => {
   fs.readFile(`build/prisma.html`,'utf-8',(error,resonse)=>{
   if(error) console.log(error)
   res.send(resonse)
  })
})


router.get('/getProduct', getProduct)
router.post('/postComment', postComment)
router.patch('/updateComment', updateComment)
router.get('/getBrandmodel', getBrandmodel)
router.get('/getComment',getComment)
router.all('*', (req: Request, res: Response) => {
   res.json({ message: 'path is not found' })
})
export default router
