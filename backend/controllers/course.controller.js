import Course from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";



// --- ១. បង្កើតវគ្គសិក្សាថ្មី (Create Course) ---
export const createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  console.log(title, description, price);
  const adminId = req.adminId;  
  try {


   
    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ខ. ពិនិត្យរូបភាព (ត្រូវប្រាកដថាប្រើ express-fileupload ក្នុង index.js)
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageFile = req.files.image;
    const allowedFormats = ["image/jpeg", "image/png"];

    if (!allowedFormats.includes(imageFile.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only JPEG and PNG formats are allowed" });
    }

    // គ. Upload រូបភាពទៅកាន់ Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.tempFilePath);

    if (!result || result.error) {
      return res
        .status(500)
        .json({ message: "Error uploading image to Cloudinary" });
    }

   
    const newCourse = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      creatorId: adminId, // បន្ថែម adminId ជា creatorId នៅទីនេះ
    }
    
  );

   

    // ង. បោះចម្លើយតបទៅ Client
    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
  const { title, description, price, image } = req.body; 

  try {
    // 1. ស្វែងរក Course ដោយប្រើ id (ដែលបានមកពី req.params.id)
    const courseSearch = await Course.findById(id); 
    
    if (!courseSearch) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. ធ្វើបច្ចុប្បន្នភាព
    const updatedCourse = await Course.updateOne(
      { 
        _id: id, 
        creatorId: adminId
      },
      { 
        $set: { // គួរប្រើ $set ដើម្បីសុវត្ថិភាពទិន្នន័យ
          title, 
          description, 
          price, 
          image: {
            public_id: image?.public_id,
            url: image?.url,
          }
        }
      }
    );

    // 3. បញ្ជាក់៖ updateOne នឹងបោះត្រឡប់មកវិញនូវ result object (acknowledged, modifiedCount...)
    // មិនមែនបោះ data របស់ course មកវិញទេ។
    res.status(200).json({
      message: "Course updated successfully",
      result: updatedCourse, 
    });

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server Error" });
  }

};

// --- ៣. លុបវគ្គសិក្សា (Delete Course - បន្ថែមជូន) ---
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
  try {
    const course = await Course.findOneAndDelete({ _id: id, creatorId: adminId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({
      message: "Courses retrieved successfully",
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log("Error retrieving courses:", error);
  }
};
export const coursesDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({
      message: "Course details retrieved successfully",
      course,
    });
  } catch (error) {
    console.error("Error retrieving course details:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

import Stripe from "stripe"
import config from "../config.js";
const stripe  = new Stripe (config.STRIPE_SECRET_KEY

);
  console.log(config.STRIPE_SECRET_KEY)


export const buyCourse = async (req, res) => {
  const userId = req.userId; // ប្រើ req.userId (តាម middleware របស់អ្នក)
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    
    const existingPurchase = await Purchase.findOne({
      userId: userId,
      courseId: courseId,
    });

    if (existingPurchase) {
      return res.status(400).json({ errors: "Course already purchased" });
    }


// Create a PaymentIntent with the order amount and currency
const amount=course.price;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount*100,
    currency: "usd",
    payment_method_types:["card"]
   
  });
// ===========================================================




   
    res.status(201).json({
      message: "Course purchased successfully",
      course,
       clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error buying course:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



