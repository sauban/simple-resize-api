import validUrl from 'valid-url';
import sharp from 'sharp';
import request from 'request';

exports.checkUrl = (req, res, next) => {
	const { url: imageUrl } = req.body;

	if (!imageUrl) {
		res.status(400).json({
			message: 'Image url is required'
		});
	}

	if (!validUrl.isHttpUri(imageUrl)) {
		res.status(400).json({
			message: 'Invalid url provided'
		});
	}

	const isImageUrl = /.(png|jpeg|jpg)$/.test(imageUrl);

	if (!isImageUrl) {
		res.status(400).json({
			message: 'Url must point to an image file'
		});
	}

	next();
};

exports.resize = (req, res) => {
	const { url: imageUrl } = req.body;

	res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment; filename=image50x50.png'
        });

	request(imageUrl)
		.pipe(thumbnailResize)
		.pipe(res)
}

const thumbnailResize = sharp().resize(50, 50).png()



