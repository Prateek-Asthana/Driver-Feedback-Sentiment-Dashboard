# Driver Feedback & Sentiment Dashboard - Setup & Deploy Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Project Structure](#project-structure)
5. [Component Guide](#component-guide)
6. [Customization](#customization)
7. [Deployment](#deployment)
8. [API Integration](#api-integration)

---

## 📊 Project Overview

A professional React-based Driver Feedback & Sentiment Dashboard featuring:
- Real-time sentiment analysis
- Driver feedback management
- Interactive analytics charts
- Responsive mobile design
- Modern UI with Tailwind CSS

**Tech Stack:**
- React 18.2+
- Vite 5.0+
- Tailwind CSS 3.3+
- Recharts 2.10+
- Lucide React (Icons)

---

## 💻 Installation

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn package manager

### Steps

1. **Navigate to project directory**
   ```bash
   cd "Prateek Moveinsync"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm --version
   node --version
   ```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
- Opens at `http://localhost:3000`
- Hot reload enabled
- Development tools accessible
- Great for development and testing

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally before deployment

---

## 📁 Project Structure

```
Prateek Moveinsync/
│
├── public/                          # Static assets
│   └── logo.svg                     # Logo file
│
├── src/                             # Source code
│   ├── components/                  # React components
│   │   ├── Dashboard.jsx            # Main dashboard - metrics & charts
│   │   ├── Header.jsx               # Top navigation bar
│   │   ├── Sidebar.jsx              # Left sidebar menu
│   │   ├── MetricsCard.jsx          # KPI metric cards
│   │   ├── SentimentChart.jsx       # Sentiment visualization charts
│   │   └── FeedbackList.jsx         # Feedback table & modal
│   │
│   ├── App.jsx                      # Root component
│   ├── index.jsx                    # React entry point
│   └── index.css                    # Global styles
│
├── index.html                       # Main HTML file
├── package.json                     # Project dependencies
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS configuration
├── .env.example                     # Environment variables example
├── .gitignore                       # Git ignore rules
├── README.md                        # Full documentation
├── QUICK_START.md                   # Quick start guide
└── SETUP_GUIDE.md                   # This file
```

---

## 🎨 Component Guide

### Dashboard.jsx
**Purpose:** Main dashboard page with all metrics and charts
**Features:**
- Displays 4 metric cards (Total, Positive, Neutral, Negative)
- Date range selector
- Sentiment trend chart
- Recent feedback list
- Responsive grid layout

**Key Props:** None (uses internal state)

### Header.jsx
**Purpose:** Top navigation bar
**Features:**
- MoveInSync logo (customizable)
- Menu toggle for mobile
- Notification bell
- User profile button

**Props:**
- `onMenuClick`: Function to toggle sidebar

### Sidebar.jsx
**Purpose:** Left navigation sidebar
**Features:**
- Menu items (Dashboard, Feedback, Analytics, Settings)
- Mobile responsive with overlay
- Active menu highlighting
- Logout button

**Props:**
- `isOpen`: Boolean for sidebar visibility
- `setIsOpen`: Function to toggle sidebar

### MetricsCard.jsx
**Purpose:** Individual KPI metric card
**Features:**
- Animated entrance
- Trend indicators (positive/negative)
- Customizable colors
- Icon support

**Props:**
- `title`: Card title
- `value`: Metric value
- `change`: Percentage change
- `color`: Background color class
- `icon`: Emoji icon

### SentimentChart.jsx
**Purpose:** Sentiment visualization
**Features:**
- Stacked bar chart
- Weekly breakdown
- Recharts library
- Responsive container

### FeedbackList.jsx
**Purpose:** Feedback table and details modal
**Features:**
- Searchable table
- Star ratings
- Sentiment badges
- Detailed modal view
- Responsive table

---

## 🎨 Customization

### Change Logo
File: `src/components/Header.jsx`, Line 14
```jsx
<img
  src="https://moveinsync.com/wp-content/uploads/2020/03/Header-Logo-White.svg"
  alt="MoveInSync Logo"
  className="h-8 sm:h-10"
/>
```

### Change Primary Colors
File: `tailwind.config.js`
```javascript
const colors = {
  primary: '#FF6B35',      // Orange
  secondary: '#004E89',    // Dark Blue
  success: '#1abc9c',      // Teal
  warning: '#f39c12',      // Orange
  danger: '#e74c3c',       // Red
};
```

### Modify Mock Data
Update data objects in respective components:
- **Dashboard.jsx** - Metrics values
- **SentimentChart.jsx** - Chart data array
- **FeedbackList.jsx** - Feedback array

### Add Custom Fonts
Edit `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

---

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Deploy to Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

### Deploy to Traditional Server
```bash
npm run build
# Copy contents of 'dist/' folder to your server
```

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t dashboard .
docker run -p 3000:3000 dashboard
```

---

## 🔗 API Integration

### Current Setup (Mock Data)
Components use hardcoded mock data for demonstration.

### Connect Real API

1. **Update Dashboard.jsx**
   ```jsx
   import { useEffect, useState } from 'react';
   
   export default function Dashboard() {
     const [metrics, setMetrics] = useState(null);
     
     useEffect(() => {
       fetch('/api/metrics')
         .then(res => res.json())
         .then(data => setMetrics(data));
     }, []);
     
     // Use metrics in render
   }
   ```

2. **Create API Service**
   Create `src/services/api.js`:
   ```javascript
   const API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
   
   export const fetchMetrics = () => fetch(`${API_BASE}/metrics`).then(r => r.json());
   export const fetchFeedback = () => fetch(`${API_BASE}/feedback`).then(r => r.json());
   export const fetchSentiment = () => fetch(`${API_BASE}/sentiment`).then(r => r.json());
   ```

3. **Use in Components**
   ```jsx
   import { fetchMetrics } from '../services/api';
   
   useEffect(() => {
     fetchMetrics().then(setData);
   }, []);
   ```

---

## 📱 Responsive Breakpoints

| Device | Width | Breakpoint | Layout |
|--------|-------|-----------|--------|
| Mobile | <640px | sm | Single column |
| Tablet | 640-1024px | md/lg | 2-3 columns |
| Desktop | >1024px | lg/xl | Full layout |

---

## 🔧 Environment Variables

Create `.env.local` from `.env.example`:
```bash
VITE_API_BASE_URL=https://api.example.com
VITE_DEBUG_MODE=false
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run dev -- --port 3001` |
| Module not found | `npm install` |
| Dependencies error | `rm -rf node_modules && npm install` |
| Build fails | Clear cache: `rm -rf dist && npm run build` |

---

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts Library](https://recharts.org)
- [Lucide React Icons](https://lucide.dev)

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review React documentation
3. Check console for errors
4. Contact development team

---

**Created with ❤️ for MoveInSync**
