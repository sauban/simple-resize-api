import validUrl from 'valid-url';
import sharp from 'sharp';
import request from 'request';
import fs from 'fs';
import brokenLink from 'broken-link';
import Promise from 'bluebird';

/**
 * 
 * @param {Object} req 
 * @param {Object} req.body
 * @param {String} req.body.url
 * @param {Object} res 
 * @param {Function} next
 * @description A middleware to check validity of the image url provided
 */

exports.checkUrl = (req, res, next) => {
	const { url: imageUrl } = req.body;

	if (!imageUrl) {
		return res.status(400).json({
			message: 'Image url is required'
		});
	}

	if (!validUrl.isHttpUri(imageUrl)) {
		return res.status(400).json({
			message: 'Invalid url provided'
		});
	}

	const isImageUrl = /.(png|jpeg|jpg|tif|gif|bmp)$/.test(imageUrl);

	if (!isImageUrl) {
		return res.status(400).json({
			message: 'Url must point to an image file'
		});
	}

	next();
};

/**
 * 
 * @param {object} req - The request payload data
 * @param {object} req.body - The request body data
 * @param {string} req.body.url - The url to the image supplied
 * @param {object} res 
 * @description Endpoint does the following
 * 	- First, it checks if the Url provided is not broken
 *  		 if url is valid it downloads the file to local
 * 			 else it throws the error
 * 	- Second, it resizes the image after downloadingit to a
 * 			 temp folder and saves it to a new file
 *  - Third, Then sends the new file to the client as response. 
 */

exports.resize = (req, res) => {
	const { url: imageUrl } = req.body;
	const directory = process.cwd() + '/.tmp/';
	const file = imageUrl.split('/').pop();
	const filename = file.split('.').shift();
	const filepath = directory + file;
	const thumbpath = directory + filename + '50x50.png';

	if (!fs.existsSync(directory)){
		fs.mkdirSync(directory);
	}

	brokenLink(imageUrl)
	.then((broken) => {
		if(broken){
			throw new Error('Image url is broken');
		}
		return download(imageUrl, filepath);
	})
	.then(() => processThumbNail(filepath, thumbpath))
	.then(() => res.download(thumbpath))
	.catch(error => {
		return res.status(400).json({
			message: error.message,
			error
		})
	});
}
/**
 * 
 * @param {string} source Original file path
 * @param {string} dest  Destination file path
 * @description Function takes in two parameters to resize a
 * 				an image file to a 50 x 50 ratio 
 */
const processThumbNail = (source, dest) => {
	return new Promise((resolve, reject) => {
		sharp(source)
		.resize(50, 50)
		.png()	
		.pipe(fs.createWriteStream(dest))
		.on('error', reject)
		.on('close', resolve);
	})
}

/**
 * 
 * @param {string} uri Remote public image url
 * @param {string} dest  Path to save the file to
 * @description Function takes in two parameters to download
 * 				a remote online image to the a path in the application
 * 				using request library
 */

const download = (uri, dest) => {
	return new Promise((resolve, reject) => {
		request(uri)
		.pipe(fs.createWriteStream(dest))
		.on('error', reject)
		.on('close', resolve);
	})
};