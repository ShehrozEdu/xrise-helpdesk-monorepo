# Application Architecture Overview

The Mini Helpdesk application is built using a modern **Monorepo** architecture, emphasizing separation of concerns, high performance, and end-to-end type safety.

## 🏗️ Core Architecture Components

### 1. Monorepo Structure
The project is managed as a unified workspace with three primary packages:
- **`client/`**: A high-performance Single Page Application (SPA) built with React and Vite.
- **`server/`**: A robust RESTful API built with Node.js and Express.
- **`shared/`**: A shared library containing cross-environment TypeScript types, Zod validation schemas, and constants.

### 2. Backend Design Pattern
The server follows a **Controller-Service-Model** pattern:
- **Controllers**: Handle HTTP request parsing, input validation (via shared schemas), and response formatting.
- **Services**: Contain the core business logic, including database operations and third-party integrations (AI, Mail).
- **Models**: Define the data schema and constraints using Mongoose (ODM).

### 3. Real-time Communication Bridge
The application implements an **Event-Driven Architecture** for real-time synchronization:
- **Socket.io**: Integrated into the main HTTP server to facilitate bi-directional communication.
- **Room-based Scoping**: Users join specific "ticket rooms" to receive live updates only for relevant entities, optimizing network bandwidth.

### 4. Data Persistence & Integrity
- **Database**: MongoDB serves as the primary document store.
- **Transactions**: Critical operations (like ticket creation and subsequent event logging) are wrapped in **MongoDB ACID Transactions** to ensure data consistency across collections.

## 🚀 Technical Features

### Advanced Support Capabilities
- **AI-Powered Drafts**: Integration with **Groq (Llama 3)** for generating context-aware, empathetic support replies based on ticket history.
- **Transactional Notifications**: Automated email workflows using the **Resend SDK** for ticket confirmations and agent reply alerts.
- **Admin Analytics**: High-performance aggregation pipelines in MongoDB powering a visual dashboard (**Chart.js**) for tracking SLAs, priority distribution, and status trends.

### Security & Optimization
- **Stateless Authentication**: Implement via **JWT (JSON Web Tokens)** with secondary role-based authorization (RBAC).
- **Server State Management**: Frontend uses **TanStack Query (React Query)** for efficient caching, optimistic updates, and background data synchronization.
- **Validation Layer**: Strict runtime validation of all API payloads using **Zod**, preventing "Garbage In, Garbage Out" scenarios.

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, TailwindCSS (for Layout), Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Socket.io, Mongoose |
| **State Management** | TanStack Query, Zustand, Axios |
| **Services** | Groq AI (Llama 3), Resend (Email), Chart.js (Analytics) |
| **Infrastructure** | JWT (Auth), express-rate-limit, Winston (Logging), Zod (Validation), Vercel |
| **Models Used** | Groq (Llama-3.1-8b-instant) |

## 🌍 Deployment Architecture (Vercel)

The project is optimized for deployment as a **Vercel Monorepo**:

### 1. Frontend (Vercel Project 1)
- **Base Directory**: `client/`
- **Routing**: `vercel.json` rewrite rules ensure SPA deep-linking works (routing all unknown paths to `index.html`).
- **Build**: Vite build outputting to `client/dist`.

### 2. Backend (Vercel Project 2)
- **Base Directory**: `server/`
- **Edge Compatibility**: Optimized via `server/api/index.ts` handler which manages persistent MongoDB connections for serverless environments.
- **Routing**: `vercel.json` routes all `/api/*` traffic to the serverless function.

### 3. Shared Layer
- **Linking**: Leverages **NPM Workspaces** to resolve dependencies during build, ensuring the server and client utilize the same shared validation schemas.
