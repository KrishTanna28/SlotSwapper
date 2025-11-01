import { verifyToken } from "../utils/jwt.js";

export const jwtMiddleware = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const user = verifyToken(token);
        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({message:"Unauthorized",error:err});
    }
}