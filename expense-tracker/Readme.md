# Expense Tracker Microfrontend

The Expense Tracker microfrontend provides financial expense tracking functionality for authenticated users in the Gowtham Microfrontend application.

## Overview

This is a React-based microfrontend that offers expense management features using:

- **Material-UI** for consistent, modern UI components
- **React Router** for client-side routing
- **Webpack Module Federation** for seamless integration with the container
- **Memory History** for routing within the container environment

## Features

### Current Implementation

- **Dashboard**: Main expense tracking interface (currently a placeholder)
- **Authentication Required**: Protected routes accessible only after sign-in
- **Responsive Design**: Mobile-friendly interface using Material-UI

### Planned Features (Placeholder Implementation)

The current implementation serves as a foundation for:

- Expense entry and categorization
- Financial reporting and analytics
- Budget tracking and alerts
- Expense history and search
- Data export functionality

## Architecture

### Module Federation

The expense tracker app is exposed as a federated module with:

- **Name**: `expensetracker`
- **Exposed Module**: `./ExpenseTrackerApp` (from `./src/bootstrap`)
- **Remote Entry**: `remoteEntry.js`
- **Port**: 8083 (development)

### Shared Dependencies

Shares core React dependencies with the container:

- `react` (singleton)
- `react-dom` (singleton)
- `react-router-dom` (singleton)
- All other dependencies from package.json

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd expense-tracker
npm install
```

### Development

```bash
npm start
```

This will start the development server on `http://localhost:8083` with:

- Hot reloading enabled
- Module federation remote entry available
- Standalone development mode

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Integration with Container

### Mount Function

The expense tracker app exports a `mount` function that accepts:

- `el`: DOM element to mount the app
- `onNavigate`: Callback for navigation events
- `defaultHistory`: History object (optional)
- `initialPath`: Initial route path

### Authentication Protection

The container protects this microfrontend by:

- Redirecting unauthenticated users to the portfolio page
- Only allowing access after successful sign-in through the auth microfrontend
- Managing authentication state at the container level

### Standalone Development

When running in development mode, the app can run independently with:

- Browser history instead of memory history
- Direct access to the dashboard
- Development-specific root element (`_marketing-dev-root`)

## Routes

- `/expense-tracker/dashboard` - Main expense tracker dashboard
- `/expense-tracker` - Redirects to dashboard
- `/` (within app) - Redirects to dashboard

## Dependencies

### Core Dependencies

- `react` & `react-dom` - React framework
- `react-router-dom` - Client-side routing
- `@mui/material` & `@mui/icons-material` - Material-UI components
- `@emotion/react` & `@emotion/styled` - Styling solution
- `history` - History management for routing

### Development Dependencies

- `webpack` - Module bundler with Module Federation
- `babel` - JavaScript transpiler
- `webpack-dev-server` - Development server

## Configuration

Webpack configuration includes:

- `config/webpack.common.js` - Shared Babel configuration
- `config/webpack.dev.js` - Development setup with Module Federation
- `config/webpack.prod.js` - Production build configuration

## Development Notes

- **Current State**: The dashboard is a placeholder implementation
- **Authentication**: Requires sign-in through the auth microfrontend
- **Routing**: Uses memory history within container, browser history for standalone
- **Future Development**: Ready for expense tracking features implementation
- **Integration**: Fully integrated with the container's authentication flow

## Future Enhancements

The expense tracker is designed to be extended with:

- **Expense Management**: Add, edit, delete expense entries
- **Categories**: Organize expenses by categories
- **Analytics**: Charts and reports for spending patterns
- **Budgeting**: Set and track budgets
- **Data Persistence**: Integration with backend API for data storage
- **Export**: CSV/PDF export functionality
