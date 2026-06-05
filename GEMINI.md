# Project Gemini Guidelines

This file serves as the foundational mandate for all AI agent interactions within this project. Adhere to these standards to ensure consistency, security, and quality across the codebase.

## 🏗 Project Architecture

The project is structured as a monorepo consisting of a backend and a frontend application.

### Backend (`sp-spin3-backend`)
- **Runtime**: Node.js (ESM)
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Realtime**: WebSockets (ws)
- **Media**: Cloudinary
- **Pattern**: Module-based architecture (logic grouped by feature in `src/modules`).

### Frontend (`sp-spin3-frontend`)
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Routing**: React Router
- **Icons**: Lucide React
- **Maps**: Leaflet

## 🛠 Engineering Standards

### General
- **ES Modules**: Both frontend and backend use ESM. Use `import/export` syntax exclusively.
- **Environment Variables**: Always check `.env` files for configuration. Use `.env.example` as a template.
- **Naming Conventions**: 
  - Backend: camelCase for variables/functions, PascalCase for Models.
  - Frontend: PascalCase for components, camelCase for hooks and utilities.

### Backend Specifics
- **Module Pattern**: New features should be added as modules under `src/modules`.
- **Routes**: Define routes in `src/routes` and link them in `src/routes/index.js`.
- **Validation**: Ensure input validation is handled at the route or controller level.

### Frontend Specifics
- **Component Design**: Prefer functional components with hooks.
- **Styling**: Use Tailwind CSS utility classes. Avoid custom CSS unless necessary.
- **Icons**: Use `lucide-react` for iconography.

## 🚀 Common Commands

### Backend
- `npm run dev`: Start development server.
- `npm run seed:ingredients`: Seed initial ingredient data.
- `npm run seed:menus`: Seed initial menu data.

### Frontend
- `npm run dev`: Start Vite development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.

## 🔒 Security & Safety
- Never commit `.env` files or secrets.
- Use `bcryptjs` for password hashing.
- Use `jsonwebtoken` for authentication.
- Implement `helmet` and `cors` for basic security headers.
