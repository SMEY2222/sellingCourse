import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  // ១. ស្រង់យកទិន្នន័យនីមួយៗចេញពី req.body ឱ្យបានច្បាស់លាស់
  const { email, userId, courseId, paymentId, amount, status } = req.body;

  try {
    // ២. បញ្ជូនទិន្នន័យទាំងអស់ចូលទៅក្នុង Order.create()
    const orderInfo = await Order.create({
      email,
      userId,
      courseId,
      paymentId,
      amount,
      status,
    });

    console.log("Order Saved Successfully:", orderInfo);

    // ៣. បង្កើតទិន្នន័យក្នុង Purchase ផងដែរ
    if (orderInfo) {
      await Purchase.create({ 
        userId: userId, 
        courseId: courseId 
      });
    }

    res.status(201).json({ message: "Order Details created successfully", orderInfo });
  } catch (error) {
    console.log("Error in order creation: ", error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};
