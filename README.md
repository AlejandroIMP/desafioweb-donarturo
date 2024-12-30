
# E-commerce

Un proyecto el cual esta elaborado desde cero siguiendo los requerimientos del desafio web360 por optimatecnologia.

## Routes
```plaintext
pages/
├── auth/
│   ├── Login.jsx
│   └── Register.jsx
├── cliente/
│   ├── Home.jsx  (Catálogo de productos para clientes)
│   ├── Cart.jsx  (Carrito de compras)
│   ├── OrderHistory.jsx  (Historial de pedidos)
│   └── OrderDetails.jsx (Detalles de un pedido específico, opcional)
├── operador/
│   ├── Home.jsx  (Historial de pedidos para operadores)
│   ├── ManageProducts.jsx  (Gestión de productos)
│   ├── ManageClients.jsx  (Gestión de clientes)
│   ├── ManageCategories.jsx (Gestión de categorías)
│   ├── ManageUsers.jsx (Gestión de usuarios y roles)
│   └── OrderApproval.jsx (Aprobación/Entrega de pedidos)
├── Error404.jsx  (Página de error para rutas no encontradas)
└── LandingPage.jsx  (Página inicial, redirige según el rol)
```

## Tech Stack

**Client:** React, CSS, MUI Components

**Server:** Node, Express, Microsoft SQL Server


## Run Locally

Clone the project

```bash
  git clone https://github.com/AlejandroIMP/desafioweb-donarturo
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the backend server

```bash
  npm run dev-back
```

Start the frontend server

```bash
  npm run dev-front
```

Start the both servers

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_USER`
`DB_PASSWORD `
`DB_SERVER` 
`DB_DATABASE `
`PORT `
`JWT_SECRET`

## License

[MIT](https://choosealicense.com/licenses/mit/)

