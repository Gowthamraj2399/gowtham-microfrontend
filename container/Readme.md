# Container App

The Container app serves as the main entry point and orchestrator for the Gowtham Microfrontend architecture. It hosts multiple independent microfrontend applications and manages routing between them.

## Overview

This is a React-based container application that uses:

- **React Router** for client-side routing
- **Webpack Module Federation** for microfrontend integration
- **Material-UI** for consistent styling
- **Lazy loading** for performance optimization

## Architecture

The container app hosts three main microfrontends:

1. **Portfolio App** (`/` route) - Public portfolio website
2. **Auth App** (`/auth/*` routes) - Authentication module
3. **Expense Tracker App** (`/expense-tracker/*` routes) - Protected expense tracking application

## Routes

- `/` - Portfolio landing page
- `/auth/*` - Authentication routes (signin/signup)
- `/expense-tracker/*` - Expense tracker (requires authentication)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd container
npm install
```

### Development

```bash
npm start
```

This will start the development server on `http://localhost:8080` with hot reloading enabled.

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Dependencies

### Core Dependencies

- `react` & `react-dom` - React framework
- `react-router-dom` - Client-side routing
- `@mui/material` & `@mui/icons-material` - Material-UI components
- `@emotion/react` & `@emotion/styled` - Styling solution

### Development Dependencies

- `webpack` - Module bundler
- `babel` - JavaScript transpiler
- `webpack-dev-server` - Development server

## Configuration

Webpack configuration is split into:

- `config/webpack.common.js` - Shared configuration
- `config/webpack.dev.js` - Development-specific settings
- `config/webpack.prod.js` - Production build settings

## Authentication Flow

1. User accesses protected routes (e.g., `/expense-tracker/*`)
2. If not signed in, redirected to portfolio page
3. User navigates to auth routes to sign in
4. Upon successful authentication, user is redirected to expense tracker
5. Authentication state is managed locally in the container

## Microfrontend Integration

Each microfrontend is loaded lazily using React's `lazy()` and `Suspense` components. The container provides:

- Shared routing context
- Authentication state management
- Consistent UI theming
- Loading states during module loading

## Development Notes

- All microfrontends should be running simultaneously for full functionality
- The container expects each microfrontend to expose specific mount functions
- Hot reloading works across all federated modules during development
