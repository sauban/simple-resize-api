import { Router } from 'express';
import { login, authorization } from './auth';
import { validatePayload, patch } from './json_patch';
import { checkUrl, resize } from './img_resize';

const routes = Router();

/**
 * POST /login
 * Public login route to obtain
 * jwt signed token
 */
routes.post('/login', login);

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
