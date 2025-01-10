
# E-commerce

Un proyecto el cual esta elaborado desde cero siguiendo los requerimientos del desafio web360 por optimatecnologia.

## Routes
```plaintext
Directory structure:
└── AlejandroIMP-desafioweb-donarturo/
    ├── README.md
    ├── package.json
    ├── .env.example
    ├── desafiosql/
    │   └── GDA004-OT-DavidSian.sql
    └── packages/
        ├── backend/
        │   ├── README.md
        │   ├── nodemon.json
        │   ├── package.json
        │   ├── tsconfig.json
        │   ├── POSTMAN/
        │   │   ├── Category CRUD.postman_collection.json
        │   │   ├── Clientes CRUD.postman_collection.json
        │   │   ├── Estados CRUD.postman_collection.json
        │   │   ├── Login&Register.postman_collection.json
        │   │   ├── Orden y Detalles CRUD.postman_collection.json
        │   │   └── Product CRUD.postman_collection.json
        │   └── src/
        │       ├── app.ts
        │       ├── index.ts
        │       ├── config/
        │       │   └── roles.ts
        │       ├── controllers/
        │       │   ├── auth.controller.ts
        │       │   ├── clients.controller.ts
        │       │   ├── orderAndDetails.controller.ts
        │       │   ├── productcategory.controller.ts
        │       │   ├── products.controller.ts
        │       │   ├── state.controller.ts
        │       │   └── users.controller.ts
        │       ├── database/
        │       │   └── connection.ts
        │       ├── interfaces/
        │       │   ├── auth.interface.ts
        │       │   ├── clients.interface.ts
        │       │   ├── orderAndDetails.interface.ts
        │       │   ├── product.interface.ts
        │       │   ├── productcategory.interface.ts
        │       │   ├── state.interface.ts
        │       │   └── token.interface.ts
        │       ├── middleware/
        │       │   ├── auth.ts
        │       │   └── validateOrder.ts
        │       ├── models/
        │       │   ├── auth.models.ts
        │       │   ├── clients.models.ts
        │       │   ├── orderAndDetails.models.ts
        │       │   ├── productcategory.models.ts
        │       │   ├── products.models.ts
        │       │   └── state.models.ts
        │       └── routes/
        │           ├── auth.routes.ts
        │           ├── clients.routes.ts
        │           ├── orderAndDetails.routes.ts
        │           ├── productcategory.routes.ts
        │           ├── products.routes.ts
        │           ├── state.routes.ts
        │           └── users.routes.ts
        └── frontend/
            ├── README.md
            ├── eslint.config.js
            ├── index.html
            ├── package.json
            ├── tsconfig.app.json
            ├── tsconfig.json
            ├── tsconfig.node.json
            ├── vite.config.ts
            ├── .gitignore
            ├── public/
            │   └── 282599.webp
            └── src/
                ├── App.tsx
                ├── main.tsx
                ├── vite-env.d.ts
                ├── assets/
                ├── components/
                │   ├── ButtonVisibility/
                │   │   └── index.tsx
                │   ├── Card/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── CategoryCreateForm/
                │   │   └── index.tsx
                │   ├── CategoryUpdateForm/
                │   │   └── index.tsx
                │   ├── CheckoutCard/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── CheckoutSideMenu/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── ClientCreateForm/
                │   │   └── index.tsx
                │   ├── ClientUpdateForm/
                │   │   └── index.tsx
                │   ├── Container/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── LabelState/
                │   │   └── index.tsx
                │   ├── LoginForm/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── NavbarAdmin/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── NavbarHome/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── NavbarLanding/
                │   │   └── index.tsx
                │   ├── OrderCard/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── OrderUpdateForm/
                │   │   └── index.tsx
                │   ├── OrderWithDetailsCard/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── ProductCreateForm/
                │   │   └── index.tsx
                │   ├── ProductUpdateForm/
                │   │   └── index.tsx
                │   ├── RegisterForm/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── ToggleColorMode/
                │   │   └── index.tsx
                │   ├── UserCreateForm/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   └── UserUpdateForm/
                │       └── index.tsx
                ├── context/
                │   ├── ClientContext.tsx
                │   ├── authContext.tsx
                │   └── themeContext.tsx
                ├── hooks/
                │   ├── index.tsx
                │   └── context/
                │       └── useClientContext.tsx
                ├── interfaces/
                │   ├── auth.interface.ts
                │   ├── clientrol.interface.ts
                │   ├── clients.interface.ts
                │   ├── orderAndDetails.interface.ts
                │   ├── product.interface.ts
                │   ├── productcategory.interface.ts
                │   ├── state.interface.ts
                │   ├── token.interface.ts
                │   └── users.interface.ts
                ├── layouts/
                │   ├── AdminLayout.tsx
                │   ├── AuthLayout.tsx
                │   ├── ClientLayout.tsx
                │   ├── LandingLayout.tsx
                │   └── index.css
                ├── pages/
                │   ├── Client/
                │   │   ├── Cart/
                │   │   │   └── index.tsx
                │   │   ├── Checkout/
                │   │   │   └── index.tsx
                │   │   ├── Home/
                │   │   │   ├── index.css
                │   │   │   └── index.tsx
                │   │   ├── Order/
                │   │   │   └── index.tsx
                │   │   └── Orders/
                │   │       └── index.tsx
                │   ├── Landing/
                │   │   └── index.tsx
                │   ├── NotFound/
                │   │   ├── index.css
                │   │   └── index.tsx
                │   ├── admin/
                │   │   ├── AdminHome/
                │   │   │   └── index.tsx
                │   │   ├── CategoryManagment/
                │   │   │   └── index.tsx
                │   │   ├── ClientsManagment/
                │   │   │   └── index.tsx
                │   │   ├── OrderApproval/
                │   │   │   └── index.tsx
                │   │   ├── OrdersManagment/
                │   │   │   └── index.tsx
                │   │   ├── ProductManagment/
                │   │   │   ├── index.css
                │   │   │   └── index.tsx
                │   │   └── UserManagment/
                │   │       ├── index.css
                │   │       └── index.tsx
                │   └── auth/
                │       ├── Login/
                │       │   └── index.tsx
                │       └── Register/
                │           └── index.tsx
                ├── schemas/
                │   ├── auth.schemas.tsx
                │   ├── categories.schemas.ts
                │   ├── client.schemas.ts
                │   ├── order.schemas.tsx
                │   ├── product.schemas.ts
                │   └── user.schemas.ts
                ├── services/
                │   ├── categories.service.ts
                │   ├── clients.service.ts
                │   ├── orders.service.ts
                │   ├── products.service.ts
                │   └── users.service.ts
                └── utils/
                    ├── authUtils.tsx
                    ├── checkoutUtils.tsx
                    ├── loginUtils.tsx
                    ├── orderUtils.tsx
                    └── registerUtils.tsx

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

