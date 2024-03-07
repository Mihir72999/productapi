const whitelist = ['http://localhost:5173', 'https://coverapp.onrender.com', 'https://mobapp-blue.vercel.app','http://127.0.0.1:5500']


type CorsOriginCallback = (error: Error | null , allow: boolean | string) => void;


export const corsOptions = {
  origin: (origin:any , callback:CorsOriginCallback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('block by origins') , false) 
    }
  },
  credentials:true,
  optionsSuccessStatus:200

}
