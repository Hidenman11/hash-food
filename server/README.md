# HASH FOOD API

Node.js (Express) backend with **PostgreSQL** (Prisma), **JWT auth**, **orders / restaurants / riders** REST APIs, **Tanzania mobile money** integration hooks, and **Socket.io** for live rider + order room updates. A **Google Maps** browser key endpoint and optional **Directions** proxy are included.

## Quick start

1. Start Postgres (from repo root):

   ```bash
   docker compose up -d postgres
   ```

2. Configure env:

   ```bash
   cd server
   cp .env.example .env
   ```

3. Install and migrate:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

API base: `http://localhost:4000`  
Health: `GET /health`  
REST: `/v1/...`  
Socket.io: same host/port (JWT in `handshake.auth.token` or `Authorization: Bearer`).

## Auth

- `POST /v1/auth/register` — body: `{ email, password, phone?, fullName?, role? }`  
  Public roles: `CUSTOMER`, `RESTAURANT_ADMIN`, `RIDER`. (`ADMIN` is seed-only.)
- `POST /v1/auth/login` — `{ email, password }`
- `GET /v1/auth/me` — `Authorization: Bearer <jwt>`

## Restaurants & menu

- `GET /v1/restaurants?city=Mwanza&q=pizza`
- `GET /v1/restaurants/:idOrSlug`
- `GET /v1/restaurants/:idOrSlug/menu`
- `POST /v1/restaurants` — `RESTAURANT_ADMIN` or `ADMIN`

## Orders

- `POST /v1/orders` — customer; body includes `restaurantId`, `deliveryAddress`, `items[]`.
- `GET /v1/orders/mine` — customer history.
- `GET /v1/orders/:id` — customer / owner / rider / admin.
- `PATCH /v1/orders/:id/status` — restaurant / rider / admin (role-specific statuses).
- `PATCH /v1/orders/:id/assign-rider` — `ADMIN`, body `{ riderId }`.

## Mobile money (Tanzania)

- `POST /v1/payments/mobile-money/intent` — customer JWT; `{ orderId, provider, msisdn }`  
  `provider`: `MPESA`, `AIRTEL_MONEY`, `TIGO_PESA`, `HALOPESA`, `MOCK`, …
- `POST /v1/payments/webhook/mobile-money` — `{ externalRef, status: "PAID" | "FAILED" }`  
  Optional header `x-webhook-secret: <MOBILE_MONEY_WEBHOOK_SECRET>`.

`MOBILE_MONEY_PROVIDER`:

- **mock** — generates a reference; complete payment via webhook.
- **flutterwave** — calls Flutterwave charge API (requires live keys + enabled TZ mobile money).
- **http** — POST JSON to `MOBILE_MONEY_HTTP_INIT_URL` for Selcom / AzamPay / your aggregator.

## Realtime (Socket.io)

After connecting with JWT:

- `order:subscribe` `{ orderId }` — join room for map + status events.
- `order:unsubscribe` `{ orderId }`
- `rider:location` `{ lat, lng, heading?, orderId? }` — **RIDER** role; broadcasts `rider:location` to the order room.

Server emits:

- `rider:location` — `{ orderId, riderId, lat, lng, heading, at }`
- `order:updated` — after webhook payment (status + paymentStatus)

## Google Maps

- `GET /v1/maps/config` — returns `googleMapsApiKey` for the JS SDK (browser key).
- `GET /v1/maps/directions?origin=lat,lng&destination=lat,lng` — JWT required; uses `GOOGLE_MAPS_SERVER_KEY`.

## Seed users (password `Password123!`)

- `admin@hashfood.local` — ADMIN  
- `owner@hashfood.local` — RESTAURANT_ADMIN (Pizza Time)  
- `rider@hashfood.local` — RIDER  
- `customer@hashfood.local` — CUSTOMER  
