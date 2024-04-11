import { Request, Response, NextFunction } from 'express'

const errorHandle = (error: any, req: Request, res: Response, next: NextFunction) => {
const status = error.statusCode ? error.statusCode : 500



  res.status(status)
  res.json({ errorMessage: error.message })

}

export default errorHandle
