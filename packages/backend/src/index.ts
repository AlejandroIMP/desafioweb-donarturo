import app from './app';
import 'dotenv/config';

app.listen(process.env.PORT);

console.log('Server running at http://localhost:5000/');