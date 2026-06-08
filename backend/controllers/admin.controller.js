
import bcrypt from "bcryptjs";
import * as z from "zod";
import jwt from "jsonwebtoken";

import { Admin } from "../models/admin.model.js";




export const signup = async (req, res) => {
  const { Firstname, Lastname, Email, Password } = req.body;

  const adminschema = z.object({
    Firstname: z
      .string()
      .min(3, { message: "Firstname must be at least 3 characters long" }),
    Lastname: z
      .string()
      .min(3, { message: "Lastname must be at least 3 characters long" }),
    Email: z
      .string()
      .email({ message: "Please provide a valid email address" }),
    Password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  });

  const validatedData = adminschema.parse(req.body);
  if (!validatedData) {
    return res
      .status(400)
      .json({ error: "validatedData.error.issues.map(err => err.message)" });
  }

  const hashPassword = await bcrypt.hash(Password, 10);

  try {
    const existingAdmin = await Admin.findOne({ Email: Email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const newAdmin = new Admin({
      Firstname,
      Lastname,
      Email,
      Password: hashPassword,
    });
    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.log("Error during signup:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const admin = await Admin.findOne({ Email });
    const isPasswordValid = await bcrypt.compare(Password, admin.Password);
    if (!admin || !isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_PASSWORD, {
      expiresIn: "1d",
    });
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true, // បង្កើត cookie ដែលមិនអាចចូលដំណើរការបានដោយ JavaScript
        secure: process.env.NODE_ENV === "production", // បង្កើត cookie ដែលមានសុវត្ថិភាពនៅក្នុងបរិបទផលិតកម្ម
        sameSite: "strict", // កំណត់ SameSite policy
    }
    res.cookie("jwt", token, cookieOptions);
    res.status(200).json({ message: "Login successful", admin, token });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Error in login" });
  }
};
export const logout = (req, res) => {
  try {
    if (!req.cookies.jwt) {

        return res.status(400).json({ message: "Kindly login first" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error during logout:", error);
    res.status(500).json({ message: "Error in logout" });
  }
};