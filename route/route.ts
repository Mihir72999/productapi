import { Router, Request, Response } from 'express'

import { getBrandmodel, getComment, getProduct, postComment, updateComment } from '../controller/controller'


const router = Router({ strict: true, caseSensitive: false, mergeParams: true })

router.get('/', (req: Request, res: Response) => {
   res.send('welcome to productApi')
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
