# REST API for Playing Card Collection – Experiment 11

A beginner‑friendly Express.js project that exposes a small REST API to manage a set of playing cards kept in memory. This continues your Node.js learning from Experiment‑10 (array of objects + CLI) and moves it to a simple HTTP server with clear routes and JSON responses.

## Objective
- Practice basic Express routing and HTTP methods (GET, POST, PUT, DELETE)
- Work with an in‑memory array of objects (no database)
- Send and receive JSON

## Components Used

### Node.js / Libraries
- `express` – minimal web framework for routing and JSON handling

### Data Structure (in memory)
```js
var cards = [
  { id: 1, suit: 'Hearts',   value: 'Ace' },
  { id: 2, suit: 'Spades',   value: 'King' },
  { id: 3, suit: 'Diamonds', value: 'Queen' }
];
```

## Endpoints

Base URL: `http://localhost:3000`

- GET `/cards` – list all cards
- GET `/cards/:id` – get a single card by id
- POST `/cards` – add a card (expects JSON body with `suit` and `value`)
- PUT `/cards/:id` – update a card by id (expects JSON body with `suit` and `value`)
- DELETE `/cards/:id` – remove a card by id

### Example Responses (Preview‑style)
- GET `/cards`
```json
[
  { "id": 1, "suit": "Hearts",   "value": "Ace" },
  { "id": 2, "suit": "Spades",   "value": "King" },
  { "id": 3, "suit": "Diamonds", "value": "Queen" }
]
```

- GET `/cards/2`
```json
{ "id": 2, "suit": "Spades", "value": "King" }
```

- POST `/cards` with body
```json
{ "suit": "Clubs", "value": "Jack" }
```
Response 201:
```json
{ "id": 4, "suit": "Clubs", "value": "Jack" }
```

- PUT `/cards/2` with body
```json
{ "suit": "Clubs", "value": "Jack" }
```
Response 200:
```json
{ "id": 2, "suit": "Clubs", "value": "Jack" }
```

- DELETE `/cards/1`
```json
{
  "message": "Card with ID 1 removed",
  "card": { "id": 1, "suit": "Hearts", "value": "Ace" }
}
```

## How to Run
1. Open a terminal in this folder:
   - `NodeJs-Project/Experiment-11`
2. Install and start:
   - `npm install`
   - `npm start`
3. Open `http://localhost:3000` to see a short help page.

> Note: The data resets every time you restart the server because it is stored in memory.

## Postman Quick Guide
- Create requests to the URLs above.
- For POST/PUT set header `Content-Type: application/json` and use a raw JSON body.
- Typical errors you can test:
  - Missing fields → 400 `{ "message": "Both suit and value are required" }`
  - Unknown id → 404 `{ "message": "Card not found" }`

## Minimal Code Map
- `server.js`
  - `app.use(express.json())` – parse JSON body
  - Routes for GET/POST/PUT/DELETE
  - Helper `getNextId()` to auto‑increment IDs

## What You Practiced
- Express.js basics (routes and JSON responses)
- HTTP verbs for CRUD‑like actions
- Simple validation and status codes
- Keeping state in an array of objects (no DB yet)

## Possible Enhancements
- Add `PATCH /cards/:id` for partial updates
- Add input validation for allowed suits/values
- Persist to a JSON file or a small database (lowdb / sqlite)
- Add request logging (e.g., morgan) and CORS (if building a frontend)
- Write unit tests for handlers

---
