import { Request, Response, NextFunction } from 'express'

const errorHandle = (error: any, req: Request, res: Response, next: NextFunction) => {
  const status = res.statusCode ? res.statusCode : 500



  res.status(status)
  res.json({ message: error.message })

}

export default errorHandle