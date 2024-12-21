import app from './app.js';
import {getConnection } from './database/connection.js';
import 'dotenv/config';

app.listen(process.env.PORT);

console.log('Server running at http://localhost:5000/');