# SWAROOP.DEV — Full-Stack Portfolio

A responsive neon/cyberpunk personal portfolio using HTML/CSS/JavaScript, Node.js, Express and MongoDB.

## Project structure

- `frontend/` — portfolio UI
- `backend/` — REST API + MongoDB
- `backend/.env.example` — environment variables

## Run locally

### 1. Create MongoDB database

Create a free MongoDB Atlas cluster and copy its connection string.

### 2. Configure backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

### 3. Start API

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 4. Open frontend

Open `frontend/index.html` in a browser.

For the best local setup, serve the frontend with a simple static server, for example VS Code Live Server.

## API

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/contact`

## Deployment

For a single-server deployment, set:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
```

Then deploy the repository to a Node-compatible host such as Render. The Express server serves `frontend/` in production.

If deploying frontend and backend separately, update `API` in `frontend/script.js` to your deployed API URL.

## Security before production

- Add admin authentication before exposing project POST/PUT/DELETE endpoints.
- Add rate limiting to the contact endpoint.
- Add stricter CORS rules.
- Validate and sanitize all user input.
- Never commit `.env`.
