import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import prisma from '../db/connectDb'

import type { BrandProductMap } from '../controller.d'



export const getProduct = asyncHandler(async (req: Request, res: Response) => {

    const product = await prisma.products.findMany()

    res.status(200).json(product)

})
export const getBrandmodel = asyncHandler(async (req: Request, res: Response) => {
    const product = await prisma.products.findMany()

    const getItem: BrandProductMap = {};

    for (let item of product) {
        const brand = item?.brand ?? ""
        if (item?.brand && item?.brand in getItem) {
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
    res.status(200).json(getItem)

})

export const postComment = asyncHandler(async (req: Request, res: Response) => {

    const { name, support, type, reactions } = req.body
    console.log(name, support, type, reactions)
    const datas = await prisma.comments.create({
        data: {
            name,
            reactions,
            type,
            support
        }
    })
    console.log(datas)
    res.status(201).json(datas)
})


export const updateComment = asyncHandler(async (req: Request, res: Response) => {



    const { id, name, reactions, type, support } = req.body
    console.log(reactions, type)
    const items = await prisma.comments.updateMany({
        where: { id: id },
        data: {
            name,
            reactions,
            type,
            support
        }
    })

    res.status(203).json({ message: `succesfully ${items.count} updated` })
})


export const getComment = asyncHandler(async(req:Request,res:Response)=>{
    const item = await prisma.comments.findMany()
    res.status(200).json(item)
})