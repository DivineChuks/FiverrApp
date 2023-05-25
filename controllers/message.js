import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import asyncHandler from "express-async-handler";

export const createMessage = asyncHandler(async (req, res, next) => {
  const newMessage = await Message.create({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  res.status(201).json(newMessage);
  await Conversation.findOneAndUpdate(
    { id: req.body.conversationId },
    {
      $set: {
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
        lastMessage: req.body.desc,
      },
    },
    { new: true }
  );

  res.status(201).send(savedMessage);
});

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    res.staus(500).send('server error');
  }
};
