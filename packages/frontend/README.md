# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

```plaintext
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

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
