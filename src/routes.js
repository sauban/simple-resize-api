import { Router } from 'express';
import auth from './auth';

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
routes.post('/login', auth.login);
export default routes;
