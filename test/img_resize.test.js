import request from 'supertest';
import sharp from 'sharp';
import app from '../src/app.js';
import { expect } from 'chai';

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
