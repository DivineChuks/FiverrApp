import asyncHandler from "express-async-handler";
import Gig from "../models/gigModel.js";

export const createGig = asyncHandler(async (req, res) => {
  if (!req.isSeller) {
    res.status(403);
    throw new Error("Only sellers can create a gig");
  }

  const existingGig = await Gig.findOne({ title: req.body.title });

  if (existingGig) {
    res.status(400);
    throw new Error("Gig with the same title already exists");
  }

  const newGig = await Gig.create({
    userId: req.userId,
    ...req.body,
  });

  res.status(201).json(newGig);
});

export const deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (req.userId !== gig.userId.toString()) {
    res.status(400);
    throw new Error("Only Gig owners can delete Gig");
  }

  await Gig.findByIdAndDelete(req.params.id);
  res.status(200).json("Gig has been deleted");
});

export const getGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) {
    res.status(400);
    throw new Error("Gig not found");
  }

  res.status(200).json(gig);
});

export const getGigs = asyncHandler(async (req, res) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  const gigs = await Gig.find(filters).sort({[q.sort]: -1});
  res.status(200).json(gigs);
});
