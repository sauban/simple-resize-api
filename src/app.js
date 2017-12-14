import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import winston from 'winston';

const app = express();
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).send('Endpoint does not exist');
});

export default app;
