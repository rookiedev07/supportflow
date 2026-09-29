import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Ticket } from './models/Ticket.js';
import { Comment } from './models/Comment.js';
import { Activity, ACTIVITY_ACTIONS } from './models/Activity.js';
import { STATUSES, PRIORITIES, CATEGORIES, ROLES } from './utils/statusTransitions.js';

export const seedDatabase = async (closeConnection = false) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  await Promise.all([
    User.deleteMany({}),
    Ticket.deleteMany({}),
    Comment.deleteMany({}),
    Activity.deleteMany({}),
    mongoose.connection.collection('counters').deleteMany({})
  ]);

  const defaultPassword = 'Password123!';

  const admin = await User.create({
    name: 'Marcus Vance',
    email: 'admin@supportflow.dev',
    password: defaultPassword,
    role: ROLES.ADMIN,
    isActive: true
  });

  const agent1 = await User.create({
    name: 'Sarah Chen',
    email: 'sarah.chen@supportflow.dev',
    password: defaultPassword,
    role: ROLES.AGENT,
    isActive: true
  });

  const agent2 = await User.create({
    name: 'Alex Rivera',
    email: 'alex.rivera@supportflow.dev',
    password: defaultPassword,
    role: ROLES.AGENT,
    isActive: true
  });

  const customer1 = await User.create({
    name: 'Elena Rostova',
    email: 'elena.rostova@acmecorp.io',
    password: defaultPassword,
    role: ROLES.CUSTOMER,
    isActive: true
  });

  const customer2 = await User.create({
    name: 'David Kim',
    email: 'david.kim@fintechlabs.com',
    password: defaultPassword,
    role: ROLES.CUSTOMER,
    isActive: true
  });

  const customer3 = await User.create({
    name: 'Sophia Martinez',
    email: 'sophia.martinez@cloudscale.net',
    password: defaultPassword,
    role: ROLES.CUSTOMER,
    isActive: true
  });

  const ticket1 = await Ticket.create({
    ticketNumber: 'SF-1001',
    title: 'Stripe webhook signature verification failure on recurring renewals',
    description: 'Since 08:30 UTC this morning, our subscription renewal webhook handler has been rejecting incoming Stripe events with HTTP 400 Signature Verification Failed. Our webhook secret has not changed in production. Several customer auto-renewals are stalled in invoice.payment_failed.',
    category: CATEGORIES.BILLING,
    priority: PRIORITIES.CRITICAL,
    status: STATUSES.IN_PROGRESS,
    createdBy: customer2._id,
    assignedTo: agent1._id
  });

  await Activity.create({
    ticket: ticket1._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer2._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by David Kim'
  });

  await Activity.create({
    ticket: ticket1._id,
    action: ACTIVITY_ACTIONS.TICKET_ASSIGNED,
    performedBy: admin._id,
    previousValue: null,
    newValue: agent1._id.toString(),
    details: 'Assigned to Sarah Chen'
  });

  await Activity.create({
    ticket: ticket1._id,
    action: ACTIVITY_ACTIONS.STATUS_CHANGED,
    performedBy: agent1._id,
    previousValue: STATUSES.OPEN,
    newValue: STATUSES.IN_PROGRESS,
    details: 'Investigation initiated by Sarah Chen'
  });

  const comment1 = await Comment.create({
    ticket: ticket1._id,
    author: agent1._id,
    message: 'Hello David, our engineering team has reproduced the issue. Stripe rolled out a minor payload timestamp header change. We are deploying a hotfix to tolerance window within 30 minutes.'
  });

  await Activity.create({
    ticket: ticket1._id,
    action: ACTIVITY_ACTIONS.COMMENT_ADDED,
    performedBy: agent1._id,
    details: 'Sarah Chen added a comment'
  });

  const ticket2 = await Ticket.create({
    ticketNumber: 'SF-1002',
    title: 'OAuth2 refresh token revoked prematurely after cluster failover',
    description: 'During our scheduled Kubernetes cluster maintenance yesterday, our API gateway failed over to region us-east-2. Since then, multiple customer sessions receive invalid_grant errors when attempting to exchange refresh tokens older than 12 hours.',
    category: CATEGORIES.SECURITY,
    priority: PRIORITIES.HIGH,
    status: STATUSES.WAITING_FOR_CUSTOMER,
    createdBy: customer1._id,
    assignedTo: agent2._id
  });

  await Activity.create({
    ticket: ticket2._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer1._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by Elena Rostova'
  });

  await Activity.create({
    ticket: ticket2._id,
    action: ACTIVITY_ACTIONS.TICKET_ASSIGNED,
    performedBy: admin._id,
    previousValue: null,
    newValue: agent2._id.toString(),
    details: 'Assigned to Alex Rivera'
  });

  await Activity.create({
    ticket: ticket2._id,
    action: ACTIVITY_ACTIONS.STATUS_CHANGED,
    performedBy: agent2._id,
    previousValue: STATUSES.OPEN,
    newValue: STATUSES.WAITING_FOR_CUSTOMER,
    details: 'Status changed to Waiting for Customer'
  });

  await Comment.create({
    ticket: ticket2._id,
    author: agent2._id,
    message: 'Hi Elena, could you verify if the redis replica sync completed during failover? Please share the token payload jti prefix so we can inspect the revoked session blacklist.'
  });

  await Activity.create({
    ticket: ticket2._id,
    action: ACTIVITY_ACTIONS.COMMENT_ADDED,
    performedBy: agent2._id,
    details: 'Alex Rivera added a comment'
  });

  const ticket3 = await Ticket.create({
    ticketNumber: 'SF-1003',
    title: 'VAT mismatch on quarterly EU enterprise invoice #INV-2026-884',
    description: 'Our accounting department noticed that invoice #INV-2026-884 generated on Sept 15 applied standard 20% VAT despite our verified reverse-charge VAT ID DE298374921 registered under Acme Europe GmbH.',
    category: CATEGORIES.BILLING,
    priority: PRIORITIES.MEDIUM,
    status: STATUSES.RESOLVED,
    createdBy: customer1._id,
    assignedTo: agent1._id
  });

  await Activity.create({
    ticket: ticket3._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer1._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by Elena Rostova'
  });

  await Activity.create({
    ticket: ticket3._id,
    action: ACTIVITY_ACTIONS.STATUS_CHANGED,
    performedBy: agent1._id,
    previousValue: STATUSES.IN_PROGRESS,
    newValue: STATUSES.RESOLVED,
    details: 'Credit memo issued and revised 0% VAT invoice uploaded'
  });

  await Comment.create({
    ticket: ticket3._id,
    author: agent1._id,
    message: 'Elena, we have re-validated your VIES number and reissued credit note #CN-2026-112 alongside the updated tax-exempt invoice. You can download it directly from your billing portal.'
  });

  const ticket4 = await Ticket.create({
    ticketNumber: 'SF-1004',
    title: 'Suspicious concurrent login alerts from unrecognized IP in Frankfurt',
    description: 'Our security audit logs recorded three concurrent sessions established within 90 seconds from an AS16509 IP block in Frankfurt. We do not have staff in that territory. Please invalidate all active auth cookies immediately.',
    category: CATEGORIES.SECURITY,
    priority: PRIORITIES.CRITICAL,
    status: STATUSES.CLOSED,
    createdBy: customer3._id,
    assignedTo: agent1._id
  });

  await Activity.create({
    ticket: ticket4._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer3._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by Sophia Martinez'
  });

  await Activity.create({
    ticket: ticket4._id,
    action: ACTIVITY_ACTIONS.STATUS_CHANGED,
    performedBy: agent1._id,
    previousValue: STATUSES.RESOLVED,
    newValue: STATUSES.CLOSED,
    details: 'Ticket resolved and confirmed closed'
  });

  const ticket5 = await Ticket.create({
    ticketNumber: 'SF-1005',
    title: 'REST API Rate Limit Headers not returned on batch export endpoints',
    description: 'Calls to /v1/exports/transactions return HTTP 200 but omit X-RateLimit-Remaining and X-RateLimit-Reset headers, causing our automated data ingestion pipeline to throttle proactively without telemetry.',
    category: CATEGORIES.TECHNICAL,
    priority: PRIORITIES.MEDIUM,
    status: STATUSES.OPEN,
    createdBy: customer2._id,
    assignedTo: null
  });

  await Activity.create({
    ticket: ticket5._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer2._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by David Kim'
  });

  const ticket6 = await Ticket.create({
    ticketNumber: 'SF-1006',
    title: 'Domain ownership DNS TXT verification failing for custom branding domain',
    description: 'We added the requested _supportflow-challenge TXT record pointing to auth.cloudscale.net more than 48 hours ago. TTL has expired across 8.8.8.8 and 1.1.1.1, but your dashboard still flags DNS_CHALLENGE_TIMEOUT.',
    category: CATEGORIES.ACCOUNT,
    priority: PRIORITIES.HIGH,
    status: STATUSES.IN_PROGRESS,
    createdBy: customer3._id,
    assignedTo: agent2._id
  });

  await Activity.create({
    ticket: ticket6._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer3._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by Sophia Martinez'
  });

  await Activity.create({
    ticket: ticket6._id,
    action: ACTIVITY_ACTIONS.TICKET_ASSIGNED,
    performedBy: admin._id,
    previousValue: null,
    newValue: agent2._id.toString(),
    details: 'Assigned to Alex Rivera'
  });

  const ticket7 = await Ticket.create({
    ticketNumber: 'SF-1007',
    title: 'SSO SAML Assertion Consumer Service URL discrepancy in Okta metadata',
    description: 'When importing your SP metadata XML into our Okta enterprise tenant, the ACS binding URL is mapped to an HTTP endpoint rather than HTTPS, which violates our strict IdP transport security policies.',
    category: CATEGORIES.TECHNICAL,
    priority: PRIORITIES.HIGH,
    status: STATUSES.OPEN,
    createdBy: customer1._id,
    assignedTo: null
  });

  await Activity.create({
    ticket: ticket7._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer1._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by Elena Rostova'
  });

  const ticket8 = await Ticket.create({
    ticketNumber: 'SF-1008',
    title: 'Downgrade prorated credit calculation discrepancy for Team tier',
    description: 'We downgraded 4 unused seats on Sept 10 mid-cycle. The prorated credit applied to our billing balance reflects 12 days instead of the remaining 20 days in our calendar billing cycle.',
    category: CATEGORIES.BILLING,
    priority: PRIORITIES.LOW,
    status: STATUSES.RESOLVED,
    createdBy: customer2._id,
    assignedTo: agent1._id
  });

  await Activity.create({
    ticket: ticket8._id,
    action: ACTIVITY_ACTIONS.TICKET_CREATED,
    performedBy: customer2._id,
    newValue: STATUSES.OPEN,
    details: 'Ticket created by David Kim'
  });

  await Activity.create({
    ticket: ticket8._id,
    action: ACTIVITY_ACTIONS.STATUS_CHANGED,
    performedBy: agent1._id,
    previousValue: STATUSES.IN_PROGRESS,
    newValue: STATUSES.RESOLVED,
    details: 'Billing cycle adjusted and $48.00 credit applied'
  });

  if (closeConnection) {
    await mongoose.connection.close();
  }
  process.stdout.write('Database seeded successfully\n');
};

const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('seed.js');
if (isDirectRun) {
  seedDatabase(true).catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });
}
