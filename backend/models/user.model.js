import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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


export const  User  = mongoose.model('User', userSchema);

