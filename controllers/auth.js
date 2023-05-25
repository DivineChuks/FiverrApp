import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password, country } = req.body;
  if (!username || !email || !password || !country) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExist = await User.findOne({ username });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ ...req.body, password: hashedPassword });

  res.status(201).json({ msg: "User has been created" });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Password is not correct");
  }

  const token = jwt.sign(
    {
      id: user._id,
      isSeller: user.isSeller,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  const { password: userPassword, ...others } = user._doc;

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    })
    .status(200)
    .json(others);
});

export const logOut = (req, res) => {
  res
    .cookies("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({ msg: "Logged out successfully" });
};
