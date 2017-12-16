import { Router } from 'express';
import { login, authorization } from './auth';
import { validatePayload, patch } from './json_patch';
import { checkUrl, resize, resizeGet } from './img_resize';

const routes = Router();

/**
 * @apiDefine TheSuccessResponseData
 * @apiSuccess {String} message response message
 * @apiSuccess {Object} data variable holding actual data
 */

 /**
 * @apiDefine TheErrorResponseData
 * @apiSuccess {String} message response message
 * @apiSuccess {Object} error variable holding actual error data
 */

/**
* @apiDefine TheHeader
* @apiHeader {String} x-access-token Valid JWT token
*/

/**
 * @api {post} /login Authenticate user information
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} username User unique username.
 * @apiParam {String} password User password.
 *
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object} data Data containing the token and username.
 * @apiSuccess {String} data.token The generated JWT token and username.
 * @apiSuccess {String} data.username Authenticated user's username.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "Message": "Login successfully",
 *       "data": {
 * 		 	"token": "JKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJsYXN0bmFtZSI6IaWDA4MTRmZDMiLCJpYXQiOjE0MTg3c1MjA4MH0.Dj4niX-IgjHkaAu2fcWiZc29oq2h6MuvsaXS3DD_glA",
 * 			"username": "samwell"
 * 		 }
 *     }
 *
 * @apiError UserUnauthorized Username does not exist
 * @apiError BadRequest Username/password missing in payload
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized access to user"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 BadRequest
 *     {
 *       "message": "Username is required"
 *     }
 * 
 */

routes.post('/login', login);

 /**
 * @api {post} /json Patch json data
 * @apiName PathJson
 * @apiGroup JSON
 *     
 * @apiUse TheHeader
 * 
 * @apiParam {Object} data Payload to patch.
 * @apiParam {Object} patch The patch instruction to apply to payload data see this [http://jsonpatch.com/] for info.
 *
 * @apiUse TheSuccessResponseData
 * @apiUse TheErrorResponseData
 *
 */
 

routes.post('/json',
	authorization,
	validatePayload,
	patch
);

 /**
 * @api {post} /resize Resize image to thumbnail
 * @apiName ResizeImage
 * @apiGroup Image
 *     
 * @apiUse TheHeader
 * 
 * @apiParam {String} url Url of the image to resize.
 *
 * @apiSuccess {Blob} Image buffered data.
 *
 */

routes.post('/resize',
	authorization,
	checkUrl,
	resize
);

export default routes;
