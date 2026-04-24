# Mini Helpdesk - Advanced Ticketing System

A production-ready Helpdesk application built with a scalable **Full-Stack monorepo** architecture. This system provides a seamless experience for customers to submit issues and for agents to resolve them with the assistance of AI and real-time synchronization.

## ✨ Core Features

### 🏢 Agent & Admin Workspace
- **Real-time Dashboard**: Synchronized ticket lists that update instantly via WebSockets as new tickets arrive or statuses change.
- **AI-Powered Assistance**: Generate empathetic and professional draft replies using **Groq AI (Llama 3)**, customized to the ticket's conversation history.
- **Analytics Engine**: Comprehensive metrics for administrators, including volume trends, priority heatmaps, and status distribution via an interactive dashboard.
- **Unified Activity Feed**: A complete audit trail (timeline) for every ticket, tracking replies, status changes, and reassignments.

### 🌐 Customer Portal
- **Ticket Submission**: User-friendly form with priority selection and validation.
- **Status Tracking**: Publicly accessible status page allowing customers to check updates using their Ticket ID and Email.
- **Automated Notifications**: Transactional emails for confirmation and reply alerts.

## 🏗️ Architecture Highlights

- **Monorepo Design**: Unified codebase for Client, Server, and Shared components, ensuring type consistency across the entire stack.
- **Type-Safe API**: End-to-end TypeScript integration with **Zod** schema validation for all network payloads.
- **Resilient Data Layer**: MongoDB with **ACID Transactions** for reliable event logging and state updates.
- **Optimized UI**: React SPA with **Vite**, **TanStack Query** for state management, and **Tailwind-inspired** sleek dark-mode aesthetics.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- Groq API Key (Optional, for AI features)
- Resend API Key (Optional, for email notifications)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`.
3. Seed the database (Initializes the default users):
   ```bash
   npm run seed
   ```

### 🔐 Default Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@xriseai.com` | `AdminPass!` |
| **Support Agent** | `agent1@xriseai.com` | `Agent1Pass!` |

4. Start the development environment:
   ```bash
   npm run dev
   ```

## 📚 Documentation & Deployment
For deeper technical details and deployment instructions:
- [Architecture Documentation](file:///c:/Users/PC/Downloads/XRise%20Assessment/ARCHITECTURE.md)
- **Deployment**: This project is pre-configured for **Vercel** monorepo deployment with optimized `vercel.json` and entry points. See the Architecture file for configuration details.

---
Built with ❤️ for XRise AI Assessment.
