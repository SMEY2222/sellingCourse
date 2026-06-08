import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    Firstname: {
        type: String,
        required: true
    },
  Lastname: {
        type: String,
        required: true,
       

    },
  Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true
    }, 
}); 


export const  Admin  = mongoose.model('Admin', adminSchema);

