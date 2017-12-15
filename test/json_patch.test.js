import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('POST /json', async () => {
	let tokenString;

	beforeEach(async () => {
		const params = { username: 'user', password: 'password' };
		const loginResponse = await request(app)
			.post('/login')
			.send(params);
		const { body: { data: { token } } } = loginResponse;
		tokenString = token;
	})

	it('should return "Token header is not provided"', async () => {
		const response = await request(app)
			.post('/json')
			.expect(401);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Token header is not provided');
	});

	it('should return "Invalid auth"', async () => {
		const response = await request(app)
			.post('/json')
			.set('x-access-token', 'rubbishToken')
			.expect(401);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Invalid auth');
	});

	it('should return "Incomplete params"', async () => {
		const response1 = await request(app)
			.post('/json')
			.set('x-access-token', tokenString)
			.send({ data: {} })
			.expect(400);
		const response2 = await request(app)
			.post('/json')
			.set('x-access-token', tokenString)
			.send({ patch: {} })
			.expect(400);
		expect(response1.body).to.have.property('message');
		expect(response1.body.message).to.eql('Incomplete params');
		expect(response1.body.message).to.eql(response2.body.message);
		expect(response1.body.message).to.eql(response2.body.message);
	});

	it('should return "Invalid params"', async () => {
		const response = await request(app)
			.post('/json')
			.set('x-access-token', tokenString)
			.send({ data: 9, patch: 'patchit' })
			.expect(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Invalid params');
	});

	it('should fail with "InvalidPatch" error', async () => {
		const params = {
			patch: {},
			data: {
				foo: 'bar'
			}
		};
		const response = await request(app)
			.post('/json')
			.set('x-access-token', tokenString)
			.send(params)
			.expect(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.contain('invalid operation');
		expect(response.body).to.have.property('error');
		expect(response.body.error).to.contain({
			name: 'InvalidPatch'
		});
	});

	it('should patch json object', async () => {
		const params = {
			patch: [
				{ op: 'replace', path: '/baz', value: 'boo' },
				{ op: 'add', path: '/hello', value: ['world'] },
				{ op: 'move', from: '/foo', path: '/baba' }
			],
			data: {
				baz: 'qux',
				foo: 'bar'
			}
		};
		const response = await request(app)
			.post('/json')
			.set('x-access-token', tokenString)
			.send(params)
			.expect(200);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Patched data successfully');
		expect(response.body).to.have.property('data');
		expect(response.body.data).to.eql({
			baz: 'boo',
			baba: 'bar',
			hello: ['world']
		});
	});
});