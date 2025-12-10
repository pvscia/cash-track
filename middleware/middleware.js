import jwt from 'jsonwebtoken'

function middleware(req,res,next){
    const token = req.headers['authorization']
    if (!token) { return res.status(401).json({ message: "No token provided" }) }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid token" }) }
        req.userId = decoded.id
        
        //you passed the check point, continue to desired location
        next()
    })
}

export default middleware