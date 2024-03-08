export const module = {
    updateUser : '/updateUser',
    postRegister : '/register',
    getStarterPage:'/',
    getProduct:'/getProduct',
    postComment:'/postComment',
    updateComment :'/updateComment',
    getComment:'/getComment',
    getBrandmodel:'/getBrandmodel',
    postLogin:'/login',
    getUser:'/getUser',
    logOut:'/logout' ,
    getOrder:'/order' ,
    paymentCheckout:'/paymentCheckout' ,
    callback: '/callback' , 
    deleteAccount:'/deleteuser' ,
    getAllRouteHandler:'*',  
    webPageFromScraper:'/scraper/:productId'
}as const

