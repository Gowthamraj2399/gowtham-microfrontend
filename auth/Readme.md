# Auth Microfrontend

The Auth microfrontend provides authentication functionality for the Gowtham Microfrontend application. It includes sign-in and sign-up forms with a clean Material-UI interface.

## Overview

This is a React-based microfrontend that handles user authentication using:

- **Material-UI** for consistent, modern UI components
- **React Router** for client-side routing
- **Webpack Module Federation** for seamless integration with the container
- **Memory History** for routing within the container environment

## Features

### Authentication Forms

- **Sign In Form**: Email and password authentication with "Remember me" option
- **Sign Up Form**: User registration with first name, last name, email, and password fields
- **Form Validation**: Basic client-side validation for required fields
- **Responsive Design**: Mobile-friendly forms using Material-UI Grid system

### Routing

- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- Navigation links between sign in and sign up forms

## Architecture

### Module Federation

The auth app is exposed as a federated module with:

- **Name**: `auth`
- **Exposed Module**: `./AuthApp` (from `./src/bootstrap`)
- **Remote Entry**: `remoteEntry.js`
- **Port**: 8082 (development)

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
cd auth
npm install
```

### Development

```bash
npm start
```

This will start the development server on `http://localhost:8082` with:

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

The auth app exports a `mount` function that accepts:

- `el`: DOM element to mount the app
- `onSignIn`: Callback function called when user signs in
- `onNavigate`: Callback for navigation events
- `defaultHistory`: History object (optional)
- `initialPath`: Initial route path

### Standalone Development

When running in development mode, the app can run independently with:

- Browser history instead of memory history
- Direct access to authentication forms
- Development-specific root element (`_auth-dev-root`)

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

## Authentication Flow

1. User clicks sign in/sign up from the container
2. Auth microfrontend loads and displays appropriate form
3. User enters credentials and submits form
4. `onSignIn` callback is triggered (currently just sets authentication state)
5. Container redirects user to protected routes (e.g., expense tracker)

## Development Notes

- The authentication is currently mock - no real backend integration
- Forms include basic validation but no actual authentication logic
- The `onSignIn` callback is passed from the container and handles state management
- Memory history is used when running within container, browser history for standalone development
