# Portfolio Microfrontend

A modern, responsive portfolio website built as a microfrontend using React, Webpack Module Federation, and Tailwind CSS.

## 🚀 Features

- **Microfrontend Architecture**: Built with Webpack Module Federation for seamless integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Powered by Framer Motion
- **Modern React**: Uses React 19 with hooks and modern patterns
- **Asset Management**: Supports images, PDFs, and other static assets
- **Dark Mode Support**: Configurable dark/light themes

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Webpack 5 with Module Federation
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Date Handling**: Day.js

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:8081`

## 📜 Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the application for production

## 🏗️ Build Configuration

The project uses a modular Webpack configuration:

- `config/webpack.common.js` - Shared configuration
- `config/webpack.dev.js` - Development-specific settings
- `config/webpack.prod.js` - Production build configuration

### Module Federation

This microfrontend exposes the `PortfolioApp` component that can be consumed by a host application.

## 🎨 Styling

- Uses Tailwind CSS for utility-first styling
- Custom color palette defined in `tailwind.config.js`
- PostCSS configuration for processing CSS

## 📁 Project Structure

```
portfolio/
├── config/                 # Webpack configuration files
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, PDFs, and other assets
│   ├── components/        # React components
│   ├── App.js             # Main application component
│   ├── bootstrap.js       # Entry point for Module Federation
│   └── index.js           # Application entry point
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Gowtham** - [Portfolio](https://gowthamraj.dev)

---

Built with ❤️ using React and Webpack Module Federation</content>
