import * as commentService from '../services/commentService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createComment = async (req, res, next) => {
  try {
    const { message } = req.body;
    const comment = await commentService.createComment({
      ticketId: req.params.id,
      author: req.user,
      message
    });
    return sendSuccess(res, { comment }, 201, 'Comment added successfully');
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByTicketId(req.params.id, req.user);
    return sendSuccess(res, { comments }, 200);
  } catch (error) {
    next(error);
  }
};
