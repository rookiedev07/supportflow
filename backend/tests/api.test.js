import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, clearTestDB, disconnectTestDB } from './setup.js';
import { ROLES, STATUSES, PRIORITIES, CATEGORIES } from '../src/utils/statusTransitions.js';

describe('SupportFlow API Integration Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Authentication Endpoints', () => {
    it('registers a new customer successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('jane@example.com');
      expect(res.body.data.user.role).toBe(ROLES.CUSTOMER);
      expect(res.body.data.token).toBeDefined();
    });

    it('rejects duplicate email registration with 409', async () => {
      await request(app).post('/api/v1/auth/register').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password123!'
      });

      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Jane Clone',
        email: 'jane@example.com',
        password: 'Password123!'
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects registration with weak password with 400', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Weak Pass',
        email: 'weak@example.com',
        password: 'weak'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.password).toBeDefined();
    });

    it('logs in successfully and returns JWT', async () => {
      await request(app).post('/api/v1/auth/register').send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'Password123!'
      });

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'Password123!'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.name).toBe('Login User');
    });

    it('rejects invalid password with 401', async () => {
      await request(app).post('/api/v1/auth/register').send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'Password123!'
      });

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'login@example.com',
        password: 'WrongPassword99!'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('fetches current user via /api/v1/auth/me', async () => {
      const regRes = await request(app).post('/api/v1/auth/register').send({
        name: 'Me User',
        email: 'me@example.com',
        password: 'Password123!'
      });

      const token = regRes.body.data.token;

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('me@example.com');
    });
  });

  describe('Ticket Management and Permissions', () => {
    let customer1Token;
    let customer2Token;
    let adminToken;
    let agentToken;

    beforeEach(async () => {
      const c1 = await request(app).post('/api/v1/auth/register').send({
        name: 'Customer One',
        email: 'c1@test.com',
        password: 'Password123!',
        role: ROLES.CUSTOMER
      });
      customer1Token = c1.body.data.token;

      const c2 = await request(app).post('/api/v1/auth/register').send({
        name: 'Customer Two',
        email: 'c2@test.com',
        password: 'Password123!',
        role: ROLES.CUSTOMER
      });
      customer2Token = c2.body.data.token;

      const adm = await request(app).post('/api/v1/auth/register').send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'Password123!',
        role: ROLES.ADMIN
      });
      adminToken = adm.body.data.token;

      const ag = await request(app).post('/api/v1/auth/register').send({
        name: 'Agent User',
        email: 'agent@test.com',
        password: 'Password123!',
        role: ROLES.AGENT
      });
      agentToken = ag.body.data.token;
    });

    it('creates a ticket with default OPEN status and ticket number', async () => {
      const res = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'Database connection latency spike',
          description: 'Observed significant query timeout spikes across region eu-west-1.',
          category: CATEGORIES.TECHNICAL,
          priority: PRIORITIES.HIGH
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ticket.status).toBe(STATUSES.OPEN);
      expect(res.body.data.ticket.ticketNumber).toMatch(/^SF-\d+/);
    });

    it('prevents customer from viewing another customer ticket', async () => {
      const createRes = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'Private Billing Issue',
          description: 'Credit card charged twice for annual subscription renewal.',
          category: CATEGORIES.BILLING,
          priority: PRIORITIES.HIGH
        });

      const ticketId = createRes.body.data.ticket._id;

      const res = await request(app)
        .get(`/api/v1/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${customer2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('allows admin and agent to view any ticket', async () => {
      const createRes = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'SSO Certificate Expiry',
          description: 'Our IdP certificate expires within 48 hours and requires rollover.',
          category: CATEGORIES.SECURITY,
          priority: PRIORITIES.CRITICAL
        });

      const ticketId = createRes.body.data.ticket._id;

      const adminRes = await request(app)
        .get(`/api/v1/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(adminRes.status).toBe(200);

      const agentRes = await request(app)
        .get(`/api/v1/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${agentToken}`);
      expect(agentRes.status).toBe(200);
    });

    it('validates state transitions: rejects invalid jump from OPEN to RESOLVED', async () => {
      const createRes = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'Invalid Jump Test',
          description: 'Testing strict state machine transition validation.',
          category: CATEGORIES.GENERAL,
          priority: PRIORITIES.MEDIUM
        });

      const ticketId = createRes.body.data.ticket._id;

      const res = await request(app)
        .patch(`/api/v1/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: STATUSES.RESOLVED });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid status transition');
    });

    it('allows valid sequential status transitions: OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED', async () => {
      const createRes = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'Sequential Transition Test',
          description: 'Testing valid path from open to closed.',
          category: CATEGORIES.GENERAL,
          priority: PRIORITIES.MEDIUM
        });

      const ticketId = createRes.body.data.ticket._id;

      const step1 = await request(app)
        .patch(`/api/v1/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${agentToken}`)
        .send({ status: STATUSES.IN_PROGRESS });
      expect(step1.status).toBe(200);
      expect(step1.body.data.ticket.status).toBe(STATUSES.IN_PROGRESS);

      const step2 = await request(app)
        .patch(`/api/v1/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${agentToken}`)
        .send({ status: STATUSES.RESOLVED });
      expect(step2.status).toBe(200);
      expect(step2.body.data.ticket.status).toBe(STATUSES.RESOLVED);

      const step3 = await request(app)
        .patch(`/api/v1/tickets/${ticketId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: STATUSES.CLOSED });
      expect(step3.status).toBe(200);
      expect(step3.body.data.ticket.status).toBe(STATUSES.CLOSED);
    });

    it('records activity and allows comments', async () => {
      const createRes = await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'Activity and Comment Test',
          description: 'Testing timeline tracking across comments and status.',
          category: CATEGORIES.GENERAL,
          priority: PRIORITIES.LOW
        });

      const ticketId = createRes.body.data.ticket._id;

      const commentRes = await request(app)
        .post(`/api/v1/tickets/${ticketId}/comments`)
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({ message: 'Here is an update regarding the logs.' });

      expect(commentRes.status).toBe(201);
      expect(commentRes.body.data.comment.message).toBe('Here is an update regarding the logs.');

      const activityRes = await request(app)
        .get(`/api/v1/tickets/${ticketId}/activity`)
        .set('Authorization', `Bearer ${customer1Token}`);

      expect(activityRes.status).toBe(200);
      expect(activityRes.body.data.activities.length).toBeGreaterThanOrEqual(2);
    });

    it('enforces RBAC: customers cannot access user management endpoints', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${customer1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('supports search, filtering, and pagination in ticket listing', async () => {
      await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'Stripe webhook issue',
          description: 'Payment failure detected on webhook.',
          category: CATEGORIES.BILLING,
          priority: PRIORITIES.CRITICAL
        });

      await request(app)
        .post('/api/v1/tickets')
        .set('Authorization', `Bearer ${customer1Token}`)
        .send({
          title: 'General inquiry on API limits',
          description: 'How many requests can we perform per minute?',
          category: CATEGORIES.GENERAL,
          priority: PRIORITIES.LOW
        });

      const searchRes = await request(app)
        .get('/api/v1/tickets?search=Stripe')
        .set('Authorization', `Bearer ${customer1Token}`);

      expect(searchRes.status).toBe(200);
      expect(searchRes.body.data.tickets.length).toBe(1);
      expect(searchRes.body.data.tickets[0].title).toContain('Stripe');

      const filterRes = await request(app)
        .get('/api/v1/tickets?priority=Low')
        .set('Authorization', `Bearer ${customer1Token}`);

      expect(filterRes.status).toBe(200);
      expect(filterRes.body.data.tickets.length).toBe(1);
      expect(filterRes.body.data.tickets[0].priority).toBe('Low');
    });
  });
});
