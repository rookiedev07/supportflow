import mongoose from 'mongoose';

export const ACTIVITY_ACTIONS = {
  TICKET_CREATED: 'TICKET_CREATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  CATEGORY_CHANGED: 'CATEGORY_CHANGED',
  TICKET_ASSIGNED: 'TICKET_ASSIGNED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  TICKET_UPDATED: 'TICKET_UPDATED'
};

const activitySchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true
    },
    action: {
      type: String,
      enum: Object.values(ACTIVITY_ACTIONS),
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    previousValue: {
      type: String,
      default: null
    },
    newValue: {
      type: String,
      default: null
    },
    details: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

activitySchema.index({ ticket: 1, createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
