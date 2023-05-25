import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  if (req.userId !== user._id.toString()) {
   res.status(400);
    throw new Error("You can only delete your account");
  } 
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json("Account deleted");
});


export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};
