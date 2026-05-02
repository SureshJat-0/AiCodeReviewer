# AI Code Reviewer

AI Code Reviewer is a full-stack web app that analyzes code with AI and returns a structured review covering bugs, security issues, and best practices. You can paste code directly, upload a file, or review a file from GitHub. The app also supports exporting review results and sharing them publicly.

## Live Demo

- Live app: https://ai-code-reviewer-studio.vercel.app

## Docker Hub

- Docker Hub repository: https://hub.docker.com/r/sureshjat0/ai-code-reviewer
- Client image: `sureshjat0/ai-code-reviewer:client`
- Server image: `sureshjat0/ai-code-reviewer:server`

## Features

- AI-powered code review for bugs, security, and best practices
- Paste code, upload a file, or review a GitHub blob URL
- Public shareable review links
- Export results as PDF or JSON
- Responsive UI with a mobile-friendly navbar and layout

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Monaco Editor
- Backend: Node.js, Express, MongoDB
- AI: Google Gemini / Google GenAI APIs
- Containerization: Docker, Docker Compose, Nginx

## Project Structure

```text
.
├── Client/
│   ├── src/
│   ├── .env
│   ├── docker.env
│   ├── Dockerfile
│   └── package.json
├── Server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── Dockerfile
│   ├── .env
│   ├── docker.env
│   └── package.json
└── docker-compose.yml
```

## Local Setup

### Prerequisites

- Node.js 22+ recommended
- MongoDB running locally or a MongoDB Atlas connection string
- Google Gemini / GenAI API key

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd AICodeReview
```

### 2) Configure environment variables

Create or update these files:

#### `Server/docker.env`

```env
PORT=3000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/ai-code-reviewer
GOOGLE_AI_API_KEY=your_google_api_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

#### `Client/docker.env`

```env
VITE_API_BASE_URL=http://localhost:3000
```

> If you use a different frontend port, update `CLIENT_URL` accordingly.

### 3) Install dependencies

```bash
cd Server
npm install

cd ../Client
npm install
```

### 4) Start the app locally

Run the backend in one terminal:

```bash
cd Server
npm run dev
```

Run the frontend in another terminal:

```bash
cd Client
npm run dev
```

The Vite app runs on `http://localhost:5173` and the API on `http://localhost:3000`.

## Docker Setup

This repository includes a `docker-compose.yml` that runs the client, server, and MongoDB.

### Option 1: Pull published images

The compose file currently references published images:

- `sureshjat0/ai-code-reviewer:client`
- `sureshjat0/ai-code-reviewer:server`

If those images are available on Docker Hub, you can run:

```bash
docker compose up -d
```

### Option 2: Build the images locally

If you want to build from source, update `docker-compose.yml` to use `build:` contexts or build the images manually.

You can build the client image from `Client/`:

```bash
cd Client
docker build -t ai-code-reviewer-client .
```

And the server image from `Server/`:

```bash
cd Server
docker build -t ai-code-reviewer-server .
```

### Start everything with Compose

```bash
docker compose up --build
```

### Services and ports

- Client: `http://localhost`
- Server: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017`

### Notes

- The server container expects `MONGO_URI`, `CLIENT_URL`, and API keys in `Server/docker.env`.
- The client container expects `VITE_API_BASE_URL` in `Client/docker.env`.
- MongoDB data is persisted in the `aiCodeReviewerDatabase` Docker volume.

