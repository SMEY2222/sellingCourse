import jwt from "jsonwebtoken";

export function adminMiddleware(req, res, next) {
    // 1. ទាញយក Token ពី Authorization Header
    const authHeader = req.headers.authorization;

    // 2. ឆែកមើលថាមាន Token ឬអត់ និងមានទម្រង់ 'Bearer ' ឬអត់
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "No token provided or invalid format" });
    }

    // 3. បំបែកយកតែ Token ចេញពី Bearer
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verify Token (ប្រើ Secret Key ឱ្យត្រូវតាម .env របស់អ្នក)
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_ADMIN_PASSWORD);
        
        console.log("Decoded successful");

        // 5. បញ្ជូន ID របស់ Admin ទៅកាន់ Controller (ត្រូវប្រើឈ្មោះឱ្យដូចក្នុង Controller របស់អ្នក)
        req.adminId = decoded.id; 
        
        // 6. អនុញ្ញាតឱ្យទៅកាន់ Controller
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export default adminMiddleware;
