const express = require('express');
const router = express.Router();


const bookRouter = require("./routes/book");
const userRouter = require("./routes/user");
const reviewRouter = require("./routes/review");

router.use("/books", bookRouter);
router.use("/user", userRouter);
router.use("/review", reviewRouter);

module.exports = router;