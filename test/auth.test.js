import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

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