export const STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER: 'WAITING_FOR_CUSTOMER',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

export const PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const CATEGORIES = {
  TECHNICAL: 'Technical',
  BILLING: 'Billing',
  ACCOUNT: 'Account',
  SECURITY: 'Security',
  GENERAL: 'General'
};

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN'
};

const ALLOWED_TRANSITIONS = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'],
  WAITING_FOR_CUSTOMER: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: ['OPEN']
};

export const getAllowedTransitions = (currentStatus, userRole = null) => {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (currentStatus === 'CLOSED' && userRole !== ROLES.ADMIN) {
    return [];
  }
  return allowed;
};

export const isValidTransition = (currentStatus, nextStatus, userRole = null) => {
  if (currentStatus === nextStatus) {
    return false;
  }
  const allowed = getAllowedTransitions(currentStatus, userRole);
  return allowed.includes(nextStatus);
};
