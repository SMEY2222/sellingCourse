import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import courseRoutes from './routes/course.route.js';
import userRoutes from './routes/user.route.js';
import adminRoute from "./routes/admin.route.js";
import orderRoute from './routes/order.route.js';





import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

import cookieParser from 'cookie-parser';
import cors from 'cors';





dotenv.config();
const app = express();

// --- CORS  ---

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200

})
);



app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // ត្រូវរំកិលមកដាក់នៅទីនេះ
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// --- ២. ការកំណត់ផ្សេងៗ ---
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB Connection Error:', err));

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- ៣. Routes (ត្រូវនៅក្រោយ Middleware) ---
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoute);


app.use("/api/v1/order", orderRoute); 



// --- ៤. Start Server ---
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


