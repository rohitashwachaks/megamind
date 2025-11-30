# PocketSchool · MIT OCW Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) ![Status](https://img.shields.io/badge/status-PWA--ready-brightgreen) ![Built with Vite](https://img.shields.io/badge/build-Vite%205-8A2BE2) ![React](https://img.shields.io/badge/ui-React%2018-61dafb)

PocketSchool is a PWA companion for MIT OCW and other open courses. It helps you track lecture progress, manage assignments, and take notes—all in a lightweight, mobile-first interface.

## ✨ Features

- **Dashboard** with "Next up" focus card and assignment snapshot
- **Course library** with progress bars, source links, and focus toggle
- **Course detail** with lecture list/status, assignments, and course notes
- **Lecture detail** with per-lecture status and note-taking
- **PWA-ready** with manifest, service worker, and home-screen install support

## 🧰 Tech Stack

- **Frontend**: React 18 + TypeScript, React Router 6, Vite 5
- **Backend**: Flask 3 + Flask-CORS, MongoDB
- **Database**: MongoDB (default) with abstraction layer for SQL support

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+** and npm
- **MongoDB** (running locally or via Docker)

## 🚀 Quick Start

### 1. Start MongoDB

Using Docker (recommended):
```bash
docker run -d -p 27017:27017 --name megamind-mongo mongo:latest
```

Or use your local MongoDB installation.

### 2. Setup Backend

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Configure environment (optional - uses defaults if not set)
cp backend/.env.example backend/.env
# Edit .env if needed

# Seed the database
python3 backend/db/seed_mongo.py

# Start the backend server
python3 backend/app.py
# Server runs on http://localhost:8000
```

### 3. Setup Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory (use `backend/.env.example` as template):

```env
# Backend Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_PORT=8000

# Database Configuration
DB_TYPE=mongo
MONGO_URI=mongodb://localhost:27017/
MONGO_DB_NAME=megamind

# CORS Configuration (comma-separated origins)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=INFO
```

## 🏗️ Project Structure

```
megamind/
├── backend/
│   ├── db/
│   │   ├── base.py           # Database abstraction layer
│   │   ├── mongo.py          # MongoDB connector
│   │   ├── sql.py            # SQL connector (stub)
│   │   ├── factory.py        # Database factory
│   │   ├── seed_mongo.py     # MongoDB seeding script
│   │   └── seed.py           # SQL seeding script
│   ├── data/
│   │   └── seed.json         # Initial seed data
│   ├── app.py                # Flask application
│   └── requirements.txt      # Python dependencies
├── src/
│   ├── api/
│   │   └── client.ts         # API client
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── state/                # State management
│   └── types.ts              # TypeScript types
├── public/
│   ├── manifest.webmanifest  # PWA manifest
│   └── sw.js                 # Service worker
└── docs/                     # Documentation
```

## 🧪 Available Scripts

### Backend
```bash
python3 backend/app.py                # Start Flask server
python3 backend/db/seed_mongo.py      # Seed MongoDB
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Type check with TypeScript
```

## 🌐 Deployment

### Build Frontend
```bash
npm run build
# Output: dist/ folder
```

### Deploy Options
- **Static hosting**: Netlify, Vercel, GitHub Pages
- **Backend**: Any Python hosting service (Heroku, Railway, DigitalOcean, etc.)

For detailed deployment instructions, see [`docs/hosting_guide.md`](docs/hosting_guide.md).

## 📱 PWA Installation

### Android (Chrome)
1. Open the site
2. Tap menu (⋮)
3. Select "Add to Home screen" or "Install app"

### iPhone (Safari)
1. Open the site
2. Tap Share button
3. Select "Add to Home Screen"

## 📖 Documentation

- [Product & UX Design](docs/design.md) - Vision and design decisions
- [Technical Implementation](docs/technical_implementation.md) - Architecture details
- [REST API Schemas](docs/rest_api_common_schemas.md) - API contracts
- [Code Review](docs/CODE_REVIEW.md) - Review and improvement recommendations
- [Hosting Guide](docs/hosting_guide.md) - Deployment instructions

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `docker ps` (if using Docker)
- Check connection string in `.env` file
- Try: `docker logs megamind-mongo` to see MongoDB logs

### Frontend Not Connecting to Backend
- Verify backend is running on port 8000
- Check CORS settings in `backend/.env`
- Clear browser cache and reload

### Port Already in Use
- Backend: Change `FLASK_PORT` in `.env`
- Frontend: Vite will auto-assign a different port

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Notes

- Backend uses MongoDB by default. Data persists across restarts.
- If you change the manifest or icons, reload and reinstall the PWA to see updates.
- For production use, configure proper CORS origins and add authentication.
- See `docs/CODE_REVIEW.md` for known issues and improvement recommendations.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MIT OpenCourseWare for the inspiration
- The open-source community for amazing tools and libraries
