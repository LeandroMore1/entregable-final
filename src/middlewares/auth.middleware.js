export function isGuest(req,res,next){
    const token = req.cookies.token
    if(!token){
        next()
    } else{
        res.redirect('/profile')
    }
}
