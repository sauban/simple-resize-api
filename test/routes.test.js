import request from 'supertest';
import sharp from 'sharp';
import app from '../src/app.js';
import { expect } from 'chai';

describe('GET /', () => {
	it('should render properly', async () => {
		await request(app)
			.get('/')
			.expect(200);
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

describe('GET /protected', async () => {
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
		const loginResponse = await request(app)
			.post('/login')
			.send(params);
		const { body: { data: { token: tokenString } } } = loginResponse;
		const response = await request(app)
			.get('/protected')
			.set('x-access-token', tokenString)
			.expect(200);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Protected content');
	});
});

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

describe('POST /resize', async () => {
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
			.post('/resize')
			.expect(401);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Token header is not provided');
	});

	it('should return "Image url is required"', async () => {
		const response = await request(app)
			.post('/resize')
			.set('x-access-token', tokenString)
			.expect(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Image url is required');
	});

	it('should return "Invalid url provided"', async () => {
		const response = await request(app)
			.post('/resize')
			.set('x-access-token', tokenString)
			.send({ url: 'www.hkk.com/w'})
			.expect(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Invalid url provided');
	});

	it('should return "Url must point to an image file"', async () => {
		const response = await request(app)
			.post('/resize')
			.set('x-access-token', tokenString)
			.send({ url: 'http://www.hkk.com/w.js'})
			.expect(400);
		expect(response.body).to.have.property('message');
		expect(response.body.message).to.eql('Url must point to an image file');
	});

	it('should resize image to 50x50', function (done) {
		this.timeout(5000);
		const url = 'http://fridayillustrated.com/wp-content/uploads/2013/11/63943_425931030823220_499384949_n.jpg';
		request(app)
			.post('/resize')
			.set('x-access-token', tokenString)
			.send({ url })
			.expect('Content-Type', 'application/octet-stream')
			.buffer()
			.parse(binaryParser)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				sharp(res.body)
				.metadata(function (err, info) {
					if (err) return done(err);
					expect(info.format).to.be.eql('png');
					expect(info.width).to.be.eql(50);
					expect(info.height).to.be.eql(50);
				});
				done();
			});
	});
});

describe('GET /404', () => {
	it('should return 404 for non-existent URLs', async () => {
		await request(app)
			.get('/404')
			.expect(404);
		await request(app)
			.get('/notfound')
			.expect(404);
	});
});


const binaryParser = (res, callback) => {
    res.setEncoding('binary');
    res.data = '';
    res.on('data', function (chunk) {
        res.data += chunk;
    });
    res.on('end', function () {
        callback(null, new Buffer(res.data, 'binary'));
    });
}
