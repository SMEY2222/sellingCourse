import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
         public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }       
}, 
{ timestamps: true }); // ថែម timestamps ដើម្បីដឹងថ្ងៃបង្កើត និងកែប្រែ (optional)

// ប្តូរពី export const មកជា export default វិញ
const Course = mongoose.model('Course', courseSchema);
export default Course;
