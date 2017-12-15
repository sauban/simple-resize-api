import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('GET /', () => {
  it('should render properly', async () => {
    await request(app).get('/').expect(200);
  });
});

describe('POST /login', () => {
  it('should return "Username is required"', async () => {
    const response = await request(app)
      .post('/login')
      .send({})
      .expect(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eql('Username is required');
  });

  it('should return "Password is required"', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'user' })
      .expect(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eql('Password is required');
  });

  it('should return "Unauthorized access"', async () => {
    const params = { username: 'unknown', password: 'password' };
    const response = await request(app)
      .post('/login')
      .send(params)
      .expect(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.contain('Unauthorized access');
    expect(response.body.message).to.contain(params.username);
  });

  it('should return "Login successfully"', async () => {
    const params = { username: 'user', password: 'password' };
    const response = await request(app)
      .post('/login')
      .send(params)
      .expect(200);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('data');
    expect(response.body.message).to.eql('Login successfully');
    expect(response.body.data).to.have.property('token');
    expect(response.body.data).to.have.property('username');
    expect(response.body.data).to.not.have.property('password');
  });
});

describe('Protected routes', async () => {
  it('should return "Token header is not provided"', async () => {
    const response = await request(app)
      .get('/protected')
      .expect(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eql('Token header is not provided');
  });

  it('should return "Invalid auth"', async () => {
    const response = await request(app)
      .get('/protected')
      .set('x-access-token', 'rubbishToken')
      .expect(401);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eql('Invalid auth');
  });

  it('should return "Protected content"', async () => {
    const params = { username: 'user', password: 'password' };
	const loginResponse = await request(app).post('/login').send(params);
    const { body: { data: { token: tokenString } } } = loginResponse;
    const response = await request(app)
      .get('/protected')
      .set('x-access-token', tokenString)
      .expect(200);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.eql('Protected content');
  });
});

describe('GET /404', () => {
  it('should return 404 for non-existent URLs', async () => {
    await request(app).get('/404').expect(404);
    await request(app).get('/notfound').expect(404);
  });
});
