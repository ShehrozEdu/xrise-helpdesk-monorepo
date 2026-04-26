# XRise Helpdesk - Server (API)

The backend engine for the XRise Helpdesk system. This is a high-performance, real-time Node.js API built with Express, TypeScript, and MongoDB.

## 🚀 Features

- **Real-time Engine**: Powered by Socket.io for instant ticket updates and notifications.
- **AI Integration**: Leverages Groq (Llama 3) to generate intelligent reply drafts.
- **Secure Auth**: JWT-based authentication with role-based access control (Admin vs. Agent).
- **Validation**: Strict type-safety using Zod schemas.
- **Email Service**: Automated notifications via Resend.
- **Analytics**: Built-in endpoints for ticket volume and performance metrics.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Security**: Helmet, Rate Limiting, Bcrypt
- **Logging**: Pino & Pino-Pretty

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (Local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShehrozEdu/xrise-helpdesk-monorepo.git
   cd xrise-helpdesk-monorepo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLIENT_URL=http://localhost:5173
   GROQ_API_KEY=your_key
   ```

4. Seed the Database (Initial Admin/Agent):
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/controllers`: Request handlers and logic.
- `src/models`: Mongoose schemas and models.
- `src/routes`: API route definitions.
- `src/services`: Business logic (AI, Mail, Tickets).
- `src/shared`: Localized shared types and validation schemas.
- `api/index.ts`: Vercel serverless entry point.

## 🔐 Default Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@xriseai.com` | `AdminPass!` |
| **Support Agent** | `agent1@xriseai.com` | `Agent1Pass!` |

## 🌐 Deployment

Deploy directly to **Vercel** as a Node.js project.

---
Built by [Shehroz](https://github.com/ShehrozEdu)
