import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import productRoutes from './routes/products.routes.js';
import stateRoutes from './routes/state.routes.js';
import productcategoryRoutes from './routes/productcategory.routes.js';
import usersRoutes from './routes/users.routes.js';
import orderAndDetailsRoutes from './routes/orderAndDetails.routes.js';
import clientsRoutes from './routes/clients.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", stateRoutes);
app.use("/api", clientsRoutes);
app.use("/api", orderAndDetailsRoutes);
app.use("/api", productcategoryRoutes);
app.use("/api", usersRoutes);

export default app;