const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const reviewSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  comments: [commentsSchema],
});

reviewSchema.methods.addComment = async function (review, req){
   try{
     if(review){
        this.comments.push(req.body.comments);
        this.save();
        return req.body.comments;
     } else {
      req.body.comments = [...req.body.comments];
      const newComment = new this({...req.body});
      newComment.save();
      return newComment;
     }
   } catch(error){
      throw new Error("something happened");
   }
};

reviewSchema.methods.updateComment = async function ( commentId, updatedCommentData ) {
  try {
    const comment = await this.comments.id(commentId);
    if (comment) {
      comment.message = updatedCommentData;
      this.save();
      return comment;
    } else {
      throw new Error("Comment not found");
    }
  } catch (error) {
     throw new Error(error);
  }
};

reviewSchema.methods.deleteComment = async function (user, commentId){
  try {
    const comment = this.comments.id(commentId);
    console.log(comment._id);
    if (comment) {
        // comment.remove();
        this.comments.pull(commentId);
        await this.save();
        console.log('Comment deleted:', comment);
        return comment;
    } else {
        console.log('Comment not found');
        throw new Error("Comment not found");
    }
} catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
}

}

const model = mongoose.model("reviews", reviewSchema);

module.exports = model;
