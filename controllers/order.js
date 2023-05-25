import asyncHandler from "express-async-handler";
import Gig from "../models/gigModel.js";
import Order from "../models/orderModel.js";
import Stripe from "stripe"

export const intent = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE);
  
    const gig = await Gig.findById(req.params.id);
  
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });
  
    await newOrder.save();
  
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  };

export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find(
        ...(req.isSeller ? {sellerId: req.userId} : {buyerId: req.userId})
    )

    res.status(200).json(orders)
});
