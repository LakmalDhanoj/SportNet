# SportNet

A full-stack web application for sports management and tracking. SportNet provides a platform for managing sports leagues, teams, players, and match scheduling with a modern React frontend and Node.js Express backend.

## 🏗️ Project Structure

```
SportNet/
├── backend/                 # Node.js Express backend
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # Backend packages
├── frontend/frontend/      # React + Vite frontend
│   ├── src/               # React source code
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # App entry point
│   │   └── assets/        # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
└── docs/                  # Documentation
    └── dev-log.md         # Development log (gitignored)
```

## 🚀 Features

### Current Implementation Status
- ✅ **Backend**: Express server running on port 5000
- ✅ **Frontend**: React + Vite setup with modern tooling
- ✅ **Development Environment**: ESLint, Vite HMR, nodemon
- ❌ **API Endpoints**: Basic server setup only (pending implementation)
- ❌ **Database**: No database integration (pending implementation)
- ❌ **Authentication**: No user authentication (pending implementation)
- ❌ **Sports Management**: Core features not yet implemented

### Planned Features
- 📊 League and team management
- 👥 Player registration and profiles
- 📅 Match scheduling and results
- 📈 Statistics and analytics
- 🔐 User authentication and authorization
- 📱 Responsive design for mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 19.2.6** - UI library
- **Vite 8.0.12** - Build tool and development server
- **ESLint** - Code linting and style enforcement
- **CSS** - Styling with modern CSS practices

### Backend
- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **nodemon** - Development server with auto-reload

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SportNet
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend/frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on http://localhost:5000

5. **Start the frontend development server**
   ```bash
   cd frontend/frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## 🧪 Development

### Running in Development Mode
- **Backend**: `npm run dev` (includes auto-reload with nodemon)
- **Frontend**: `npm run dev` (Vite with HMR)

### Build Commands
- **Frontend Build**: `npm run build`
- **Frontend Lint**: `npm run lint`

### Project Status
This project is in the initial development phase. The basic structure is set up, but core sports management features need to be implemented.

## 📝 Development Log

See [docs/dev-log.md](docs/dev-log.md) for detailed development notes and changes tracking.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update the development log
5. Submit a pull request

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or contributions, please open an issue in the repository or contact the development team.

---

**Last Updated**: 2026-05-14
**Version**: 0.1.0 - Initial Setup