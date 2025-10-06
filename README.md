# GameroomWebsite
Booking and info website for the PawsPlaysGameroom

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/GameroomWebsite.git
cd GameroomWebsite/paws-gameroom
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at http://localhost:3000

## Troubleshooting

### Blank Screen / Site Can't Be Reached

If you encounter a blank screen or "site can't be reached" error:

1. **Stop the server** (Ctrl+C)

2. **Clean install dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Clear React cache:**
```bash
rm -rf node_modules/.cache
```

4. **Restart the server:**
```bash
npm start
```

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Server won't start | Check if port 3000 is already in use: `lsof -i :3000` |
| Compilation stuck | Kill all node processes: `killall node` then restart |
| ETIMEDOUT errors | Corrupted node_modules - do a clean install (see above) |
| React Router issues | Ensure you're using BrowserRouter, not HashRouter |

### Important Notes

- **Keep the server running**: Don't close the terminal window while developing
- **Fresh install after pulling**: After `git pull`, always run `npm install`
- **React 19 + Router v7**: This project uses latest versions, ensure compatibility

## Development

### Frontend
- Located in `/paws-gameroom`
- React 19 with React Router v7
- Run with `npm start`

### Backend (if needed)
- Located in `/paws-gameroom-backend`
- Express server with IGDB/BGG integration
- Run with `npm start` (from backend directory)
