const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/github/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');
  });

  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const agent = request.agent(app);

    const login = await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(login.req.path).toEqual('/api/v1/posts');

    const logout = await agent.delete('/api/v1/github/logout');

    expect(logout.body).toEqual({ message: 'Logged Out' });
  });

  it('should allow the user to view all their posts', async () => {
    const agent = request.agent(app);

    let res = await agent.get('/api/v1/posts');

    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42');

    res = await agent.get('/api/v1/posts');

    expect(res.status).toEqual(200);
  });
});
