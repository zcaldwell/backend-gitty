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
      'https://github.com/login/oauth/authorize?client_id=67734057ed2b489c93c9&scope=user&redirect_uri=http://localhost:7890/api/v1/auth/login/callback'
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

  it('user can create a post', async () => {
    const agent = request.agent(app);
    const expected = {
      id: '1',
      content: 'example',
      userId: '1',
    };
    let res = await agent.post('/api/v1/posts').send(expected);
    expect(res.status).toEqual(401);

    await agent.get('/api/v1/github/login/callback?code=42');

    res = await agent.post('/api/v1/posts').send(expected);
    expect(res.body).toEqual(expected);
  });

  it('allows user to view list of quotes', async () => {
    const res = await request(app).get('/api/v1/quotes');
    expect(res.body).toEqual([
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
    ]);
  });
});
