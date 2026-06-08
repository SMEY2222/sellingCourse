import jwt from "jsonwebtoken";

export function userMiddleware(req, res, next) {
   
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ eventrror: "No token provided" });   


}
const token = authHeader.split(' ')[1];

try {
    const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
    console.log("Decoded"); 
   req.user = decoded.id; 
   
    next();
}catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: "Invalid token" });
}
}



export default userMiddleware;