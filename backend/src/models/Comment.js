import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

commentSchema.index({ ticket: 1, createdAt: 1 });

export const Comment = mongoose.model('Comment', commentSchema);
