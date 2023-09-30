
const Post = require("../models/postModel");
const Rating = require("../models/ratingModel");
const User = require("../models/userModel");

const ratingController = {
  createReview: async (req, res) => {
    try {
      const postId = req.params.id;
      const { rating, user } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "post not found" });
      }

      const review = new Rating({
        rating,
        post: postId,
        user,
      });

      await review.save();

      await Post.findByIdAndUpdate(
        post,
        { $push: { ratings: review._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        user,
        { $push: { ratings: review._id } },
        { new: true }
      );

      res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  getPostReviews: async (req, res) => {
    try {
      const postId = req.params.id;

      const ratings = await Rating.find({ post: postId })

      res.json({ ratings });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  deleteReview: async (req, res) => {
    try {
      const reviewId = req.params.id;

      const review = await Rating.findByIdAndRemove(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const postUpdateResult = await Post.findByIdAndUpdate(review.post, {
        $pull: { ratings: review._id },
      });

      const userUpdateResult = await User.findByIdAndUpdate(review.user, {
        $pull: { ratings: review._id },
      });

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = {
  ratingController
};
