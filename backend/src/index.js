import app from './app.js';
import {getConnection } from './database/connection.js';

app.listen(3000);

console.log('Server running at http://localhost:3000/');