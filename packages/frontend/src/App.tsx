import { BrowserRouter, Routes, Route } from "react-router";
import Landing from '@/pages/Landing/index';
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
// Admin routes
import AdminHome from "@/pages/admin/AdminHome";
import CategoryManagment from "@/pages/admin/CategoryManagment";
import ProductManagment from "@/pages/admin/ProductManagment";
import UserManagment from "@/pages/admin/UserManagment";
import ClientsManagment from "@/pages/admin/ClientsManagment"; 
import OrdersManagment from "@/pages/admin/OrdersManagment"; 
import OrderApproval from "@/pages/admin/OrderApproval"; 
// Client routes
import Cart from "@/pages/Client/Cart";
import Home from "@/pages/Client/Home";
import Order from "@/pages/Client/Order";
import Orders from "@/pages/Client/Orders";
import NotFound from "@/pages/NotFound";

import CheckoutSideMenu from "@/components/CheckoutSideMenu";

import { PrivateRoute, PublicRoute } from "@/utils/authUtils";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        } 
        />
        <Route path="/auth/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/auth/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute
            roles={[1]}
          >
            <AdminHome />
          </PrivateRoute>
        } />
        <Route path="/admin/categories" element={
          <PrivateRoute
            roles={[1]}
          >
            <CategoryManagment />
          </PrivateRoute >
        } />
        <Route path="/admin/categories/:category" element={
          <PrivateRoute
            roles={[1]}
          >
            <CategoryManagment />
          </PrivateRoute>} />
        <Route path="/admin/products" element={
          <PrivateRoute
            roles={[1]}
          >
            <ProductManagment />
          </PrivateRoute>} />
        <Route path="/admin/products/:product" element={
          <PrivateRoute
            roles={[1]}
          >
            <ProductManagment />
          </PrivateRoute>} />
        <Route path="/admin/users" element={
          <PrivateRoute
            roles={[1]}
          >
            <UserManagment />
          </PrivateRoute>} />
        <Route path="/admin/users/:user" element={
          <PrivateRoute
            roles={[1]}
          >
            <UserManagment />
          </PrivateRoute>} />
        <Route path="/admin/clients" element={
          <PrivateRoute
            roles={[1]}
          >
            <ClientsManagment />
          </PrivateRoute>} />
        <Route path="/admin/clients/:client" element={
          <PrivateRoute
            roles={[1]}
          >
            <ClientsManagment />
          </PrivateRoute>} />
        <Route path="/admin/orders" element={
          <PrivateRoute
            roles={[1]}
          >
            <OrdersManagment />
          </PrivateRoute>} />
        <Route path="/admin/orders/:order" element={
          <PrivateRoute
            roles={[1]}
          >
            <OrdersManagment />
          </PrivateRoute>} />
        <Route path="/admin/orders/approval" element={
          <PrivateRoute
            roles={[1]}
          >
            <OrderApproval />
          </PrivateRoute>} />

        {/* Client Routes */}
        <Route path="/home" element={
          <PrivateRoute
            roles={[1, 2, 3]}
          >
            <Home />
          </PrivateRoute>
        } />

        <Route path="/cart" element={
          <PrivateRoute
            roles={[1, 2, 3]}
          >
            <Cart />
          </PrivateRoute>
        } />

        <Route path="/orders" element={
          <PrivateRoute
            roles={[1, 2, 3]}
          >
            <Orders />
          </PrivateRoute>
        } />

        <Route path="/orders/:order" element={
          <PrivateRoute
            roles={[1, 2, 3]}
          >
            <Order />
          </PrivateRoute>
        } />


        <Route path="/*" element={<NotFound />} />
      </Routes>
      <CheckoutSideMenu />
    </BrowserRouter>
  );
};

export default App;