import asyncHandler from 'express-async-handler'
import Review from "../models/reviewModel.js"
import Gig from "../models/gigModel.js"

export const createReview = asyncHandler(async (req, res) => {
    if(req.isSeller){
        res.status(403)
        throw new Error('Sellers can\'t create a review ')
    }

    const review = await Review.findOne({gigId: req.body.gigId, userId: req.userId})
    if(review){
        res.status(403)
        throw new Error('You have already created a review for this gig!')
    }

    const newReview = await Review.create({
        gigId: req.body.gigId,
        userId: req.userId,
        star: req.body.star,
        desc: req.body.desc
    })

    await Gig.findByIdAndUpdate(req.body.gigId, {$inc: {totalStars: req.body.star, starNumber: 1}})
    res.status(201).json(newReview)
})

export const getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({gigId: req.params.gigId})
    res.status(200).json(reviews)
})


export const deleteReview = asyncHandler(async (req, res) => {

})