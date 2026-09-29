import * as ticketService from '../services/ticketService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const ticket = await ticketService.createTicket({
      title,
      description,
      category,
      priority,
      user: req.user
    });
    return sendSuccess(res, { ticket }, 201, 'Ticket created successfully');
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const result = await ticketService.getTickets(req.query, req.user);
    return sendSuccess(res, { tickets: result.tickets }, 200, null, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id, req.user);
    return sendSuccess(res, { ticket }, 200);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body, req.user);
    return sendSuccess(res, { ticket }, 200, 'Ticket updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await ticketService.updateTicketStatus(req.params.id, status, req.user);
    return sendSuccess(res, { ticket }, 200, 'Ticket status updated successfully');
  } catch (error) {
    next(error);
  }
};

export const assignTicket = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    const ticket = await ticketService.assignTicket(req.params.id, assignedTo, req.user);
    return sendSuccess(res, { ticket }, 200, 'Ticket assigned successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    const result = await ticketService.deleteTicket(req.params.id);
    return sendSuccess(res, result, 200, 'Ticket deleted successfully');
  } catch (error) {
    next(error);
  }
};
