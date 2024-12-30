import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import productRoutes from './routes/products.routes';
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/orderAndDetails.routes';
import stateRoutes from './routes/state.routes';
import productCategoryRoutes from './routes/productcategory.routes';
import clientsRoutes from './routes/clients.routes';
import userRoutes from './routes/users.routes';

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes)
app.use('/api', stateRoutes);
app.use('/api', productCategoryRoutes);
app.use('/api', clientsRoutes);
app.use('/api', userRoutes);


export default app;