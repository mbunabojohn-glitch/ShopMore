# ShopMore (Backend)

Backend service for ShopMore built with Node.js, Express, and MongoDB Atlas (Mongoose).

## Quick Start

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment:

Copy `.env.example` to `.env` and fill in values.

```bash
cp backend/.env.example backend/.env
```

3. Run the server:

```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## Environment Variables

File: `backend/.env.example`

- `MONGO_URI` – MongoDB Atlas connection string (SRV URI).
- `PORT` – Port to run the server (default `5000`).
- `JWT_SECRET` – Secret for signing JWTs.
- `DNS_SERVERS` – Optional comma‑separated DNS servers to resolve `mongodb+srv` (e.g., `8.8.8.8,1.1.1.1`).

## API Overview

- `GET /health` – Health check.

### Users
- `POST /api/users/make` – Create user.
- `POST /api/users/login` – Login user (returns token when `JWT_SECRET` is set).
- `GET /api/users` – Get all users.
- `GET /api/users/:_id` – Get one user.
- `PUT /api/users/:_id` – Update user.
- `DELETE /api/users/:_id` – Delete user.

### Products
- `POST /api/products/create` – Create product.
- `GET /api/products` – List products.

### Orders
- `POST /api/orders/create` – Create order.
  - Auth: Use `Authorization: Bearer <token>`
  - Or include `userId` in body when unauthenticated.
  - Body:

```json
{
  "productId": "6999d2a9fdf232e7f72954bf",
  "quantity": 2
}
```

- `GET /api/orders/all` – List all orders.
- `GET /api/orders/few` – List latest few orders.
- `GET /api/orders/:id` – Get one order.

## Notes

- Ensure your Atlas IP allowlist permits your machine.
- If SRV lookup errors occur, set `DNS_SERVERS` in `.env` or configure OS DNS.

## License

MIT
