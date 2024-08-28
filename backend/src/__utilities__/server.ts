import http from 'http';
import { app } from '../app';
import cors from 'cors';

app.use(cors());

export const server = http.createServer(app);

// module.exports = { server }