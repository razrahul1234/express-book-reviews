const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const router = express.Router();
const Review = require("../models/review");
router.use(express.json());

async function verifyToken(token) {
  return await jwt.verify(token, process.env.SECRET_KEY);
}

router.get("/bookReview/:isbn", async (req, res, next) => {
  try {
    const query = req.params;
    const review = await Review.find({ isbn: query.isbn });
    res.status(200).json(review);
  } catch (error) {
    res.send(error);
  }
});

router.post("/addReview", async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const isTokenVerified = await verifyToken(token.split(" ")[1]);
    console.log("isTokenVerified : ", isTokenVerified);
    if (isTokenVerified) {
      const review = await Review.findOne({ isbn: req.body.isbn });
      const addedComment = await review.addComment(review, req);
      res.status(200).json({ status: 201, message: "Review added", addedComment });
    } else {
      res.status(error.status || 500).send("Token Expired or Invalid");
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/modifyReview", async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const isTokenVerified = await verifyToken(token.split(" ")[1]);
    console.log("isTokenVerified : ", isTokenVerified);
    if (isTokenVerified) {
      const review = await Review.findById(req.body.id);
      console.log(review);
      if (review) {
        const updatedComment = await review.updateComment(
          req.body.commentId,
          req.body.message
        );
        res
          .status(201)
          .json({ status: 201, message: "Review modified", updatedComment });
      } else {
        res.send("Review not found");
      }
    } else {
      res.status(error.status || 500).send("Token Expired or Invalid");
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/deleteReview", async (req, res, next) => {
  try {
    const review = await Review.findById(req.body.id);
    console.log(review._id);
        if (review) {
            const deletedComment = await review.deleteComment(req.body.user, req.body.commentId);
            console.log('Deleted Comment:', deletedComment);
            res.json({status:201, message:"deleted"});
        } else {
            console.log('Review not found');
            res.send("Review not found");
    }
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
