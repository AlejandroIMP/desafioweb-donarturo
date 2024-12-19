import express from 'express';
import productRoutes from './routes/products.routes.js';
import stateRoutes from './routes/state.routes.js';
import productcategoryRoutes from './routes/productcategory.routes.js';
import usersRoutes from './routes/users.routes.js';
import orderAndDetailsRoutes from './routes/orderAndDetails.routes.js';
import clientsRoutes from './routes/clients.routes.js';

const app = express();

app.use(productRoutes);
app.use(stateRoutes);
app.use(clientsRoutes);
app.use(orderAndDetailsRoutes);
app.use(productcategoryRoutes);
app.use(usersRoutes);

export default app;