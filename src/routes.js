import { Router } from 'express';
import { login, authorization } from './auth';
import { validatePayload, patch } from './json_patch';
import { checkUrl, resize } from './img_resize';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
	res.send('Express Babel');
});


/**
 * POST /login
 * Public login route to obtain
 * jwt signed token
 */
routes.post('/login', login);

/**
 * GET /protected
 * Protected route to check
 * presence and validity of the
 * token header
 */

routes.get('/protected', authorization, (req, res) => res.status(200).json({
	message: 'Protected content'
}));

/**
 * POST /json
 * Endpoint to patch json
 * 	data
 */

routes.post('/json',
	authorization,
	validatePayload,
	patch
);

/**
 * POST /resize
 * Endpoint to resize image to 50x50
 */

routes.post('/resize',
	authorization,
	checkUrl,
	resize
);

export default routes;
