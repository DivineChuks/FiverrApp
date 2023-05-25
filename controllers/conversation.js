import Conversation from "../models/conversationModel.js";
import asyncHandler from "express-async-handler";

export const createConversation = asyncHandler(async (req, res) => {
  const newConversation = await Conversation.create({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });
  res.status(200).json(newConversation);
});

export const updateConversation = asyncHandler(async (req, res, next) => {
  const updatedConversation = await Conversation.findOneAndUpdate(
    { id: req.params.id },
    {
      $set: {
        ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
      },
    },
    { new: true }
  );

  res.status(200).send(updatedConversation);
});

export const getSingleConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({ id: req.params.id });
  if (!conversation) {
    res.status(403);
    throw new Error("Conversation does not exist");
  }

  res.status(200).json(conversation);
});

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find(
    req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
  ).sort({ updatedAt: -1 });
  res.status(200).json(conversations);
});
