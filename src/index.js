import app from './app';
import winston from 'winston';

const { PORT = 8080 } = process.env;
app.listen(PORT, () => winston.info(`Listening on port ${PORT}`)); // eslint-disable-line no-console
