import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { ROLES, STATUSES } from '../utils/statusTransitions.js';

export const getDashboardStats = async (user) => {
  if (user.role === ROLES.CUSTOMER) {
    const [counts, recentTickets, userTicketIds] = await Promise.all([
      Ticket.aggregate([
        { $match: { createdBy: user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Ticket.find({ createdBy: user._id })
        .populate('assignedTo', 'name email role')
        .sort({ updatedAt: -1 })
        .limit(5),
      Ticket.find({ createdBy: user._id }).distinct('_id')
    ]);

    const statusCounts = {
      OPEN: 0,
      IN_PROGRESS: 0,
      WAITING_FOR_CUSTOMER: 0,
      RESOLVED: 0,
      CLOSED: 0
    };

    counts.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    const recentActivity = await Activity.find({ ticket: { $in: userTicketIds } })
      .populate('performedBy', 'name email role')
      .populate('ticket', 'ticketNumber title status')
      .sort({ createdAt: -1 })
      .limit(8);

    return {
      role: ROLES.CUSTOMER,
      stats: {
        openTickets: statusCounts.OPEN,
        inProgressTickets: statusCounts.IN_PROGRESS,
        waitingTickets: statusCounts.WAITING_FOR_CUSTOMER,
        resolvedTickets: statusCounts.RESOLVED,
        closedTickets: statusCounts.CLOSED,
        totalTickets: Object.values(statusCounts).reduce((a, b) => a + b, 0)
      },
      statusDistribution: statusCounts,
      recentTickets,
      recentActivity
    };
  }

  if (user.role === ROLES.AGENT) {
    const [
      assignedCounts,
      allStatusCounts,
      priorityCounts,
      attentionCount,
      recentTickets,
      recentActivity
    ] = await Promise.all([
      Ticket.aggregate([
        { $match: { assignedTo: user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Ticket.aggregate([
        { $match: { status: { $ne: STATUSES.CLOSED } } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Ticket.countDocuments({
        $or: [
          { assignedTo: user._id, status: { $in: [STATUSES.OPEN, STATUSES.IN_PROGRESS] } },
          { assignedTo: null, status: STATUSES.OPEN }
        ]
      }),
      Ticket.find({
        $or: [{ assignedTo: user._id }, { assignedTo: null }]
      })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ updatedAt: -1 })
        .limit(6),
      Activity.find()
        .populate('performedBy', 'name email role')
        .populate('ticket', 'ticketNumber title status')
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

    const assignedStatusMap = {
      OPEN: 0,
      IN_PROGRESS: 0,
      WAITING_FOR_CUSTOMER: 0,
      RESOLVED: 0,
      CLOSED: 0
    };
    assignedCounts.forEach((c) => {
      assignedStatusMap[c._id] = c.count;
    });

    const totalStatusMap = {
      OPEN: 0,
      IN_PROGRESS: 0,
      WAITING_FOR_CUSTOMER: 0,
      RESOLVED: 0,
      CLOSED: 0
    };
    allStatusCounts.forEach((c) => {
      totalStatusMap[c._id] = c.count;
    });

    const priorityMap = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    priorityCounts.forEach((p) => {
      priorityMap[p._id] = p.count;
    });

    return {
      role: ROLES.AGENT,
      stats: {
        assignedTickets: Object.values(assignedStatusMap).reduce((a, b) => a + b, 0),
        activeAssigned:
          assignedStatusMap.OPEN +
          assignedStatusMap.IN_PROGRESS +
          assignedStatusMap.WAITING_FOR_CUSTOMER,
        requiringAttention: attentionCount,
        resolvedByAgent: assignedStatusMap.RESOLVED + assignedStatusMap.CLOSED
      },
      statusDistribution: totalStatusMap,
      priorityDistribution: priorityMap,
      recentTickets,
      recentActivity
    };
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

  const [
    totalTickets,
    statusCounts,
    priorityCounts,
    categoryCounts,
    agentWorkloadRaw,
    userCounts,
    volumeByDate,
    recentActivity
  ] = await Promise.all([
    Ticket.countDocuments(),
    Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Ticket.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Ticket.aggregate([
      { $match: { status: { $ne: STATUSES.CLOSED }, assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', activeTickets: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent'
        }
      },
      { $unwind: '$agent' },
      {
        $project: {
          agentId: '$_id',
          name: '$agent.name',
          email: '$agent.email',
          activeTickets: 1
        }
      }
    ]),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Ticket.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Activity.find()
      .populate('performedBy', 'name email role')
      .populate('ticket', 'ticketNumber title status')
      .sort({ createdAt: -1 })
      .limit(8)
  ]);

  const statusMap = {
    OPEN: 0,
    IN_PROGRESS: 0,
    WAITING_FOR_CUSTOMER: 0,
    RESOLVED: 0,
    CLOSED: 0
  };
  statusCounts.forEach((c) => {
    statusMap[c._id] = c.count;
  });

  const priorityMap = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  priorityCounts.forEach((p) => {
    priorityMap[p._id] = p.count;
  });

  const categoryMap = { Technical: 0, Billing: 0, Account: 0, Security: 0, General: 0 };
  categoryCounts.forEach((c) => {
    categoryMap[c._id] = c.count;
  });

  const userMap = { CUSTOMER: 0, AGENT: 0, ADMIN: 0 };
  userCounts.forEach((u) => {
    userMap[u._id] = u.count;
  });

  return {
    role: ROLES.ADMIN,
    stats: {
      totalTickets,
      openTickets: statusMap.OPEN,
      inProgressTickets: statusMap.IN_PROGRESS,
      resolvedTickets: statusMap.RESOLVED,
      closedTickets: statusMap.CLOSED,
      totalUsers: Object.values(userMap).reduce((a, b) => a + b, 0)
    },
    statusDistribution: statusMap,
    priorityDistribution: priorityMap,
    categoryDistribution: categoryMap,
    agentWorkload: agentWorkloadRaw,
    userOverview: userMap,
    volumeByDate,
    recentActivity
  };
};
