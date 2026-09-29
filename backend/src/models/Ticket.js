import mongoose from 'mongoose';
import { STATUSES, PRIORITIES, CATEGORIES } from '../utils/statusTransitions.js';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1000 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000
    },
    category: {
      type: String,
      enum: Object.values(CATEGORIES),
      default: CATEGORIES.GENERAL,
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITIES),
      default: PRIORITIES.MEDIUM,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(STATUSES),
      default: STATUSES.OPEN,
      required: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

ticketSchema.index({ status: 1, priority: 1, createdAt: -1 });
ticketSchema.index({ createdBy: 1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, createdAt: -1 });
ticketSchema.index({ title: 'text', description: 'text' });

ticketSchema.pre('save', async function (next) {
  if (!this.ticketNumber) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'ticketNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.ticketNumber = `SF-${counter.seq}`;
  }
  next();
});

export const Ticket = mongoose.model('Ticket', ticketSchema);
