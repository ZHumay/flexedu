const express = require("express");
const { ratingController } = require("../controllers/ratingController");

const router = require("express").Router();
router.post("/:id", ratingController.createReview);
router.get("/:id", ratingController.getPostReviews);
router.delete("/:id", ratingController.deleteReview);

module.exports = router;
