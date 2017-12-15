import { Router } from 'express';
import { login, authorization } from './auth';
import { validatePayload, patch } from './json_patch';

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
 * PUT /json
 *Endpoint to patch json
 * data
 */

routes.put('/json',
	authorization,
	validatePayload,
	patch
);

export default routes;
