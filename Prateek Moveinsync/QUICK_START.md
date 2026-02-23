# Quick Start Guide

## 🚀 Getting Started

Follow these steps to run the Driver Feedback & Sentiment Dashboard:

### Step 1: Install Node.js (if not already installed)
Download and install from: https://nodejs.org/ (LTS version recommended)

### Step 2: Install Dependencies
Open terminal/command prompt in the project folder and run:
```bash
npm install
```

This will install all required packages:
- React & React DOM
- Vite (build tool)
- Tailwind CSS
- Recharts (charting library)
- Lucide React (icons)

### Step 3: Start Development Server
```bash
npm run dev
```

The dashboard will automatically open in your browser at `http://localhost:3000`

### Step 4: Build for Production
When ready to deploy:
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

---

## 📁 Project Structure

```
Prateek Moveinsync/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      ✓ Main dashboard page
│   │   ├── Header.jsx         ✓ Top navigation bar
│   │   ├── Sidebar.jsx        ✓ Side menu
│   │   ├── MetricsCard.jsx    ✓ KPI cards
│   │   ├── SentimentChart.jsx ✓ Charts
│   │   └── FeedbackList.jsx   ✓ Feedback table
│   ├── App.jsx                ✓ Root component
│   ├── index.jsx              ✓ Entry point
│   └── index.css              ✓ Global styles
├── index.html                 ✓ Main HTML file
├── package.json               ✓ Dependencies
├── vite.config.js             ✓ Vite config
├── tailwind.config.js         ✓ Tailwind config
├── postcss.config.js          ✓ PostCSS config
└── README.md                  ✓ Full documentation
```

---

## 🎨 Dashboard Features

### 1. **Metrics Dashboard**
- Total Feedbacks: 2,451
- Positive Sentiment: 78%
- Neutral Sentiment: 15%
- Negative Sentiment: 7%

### 2. **Sentiment Analytics**
- Weekly trend charts
- Sentiment distribution
- Trend comparison (vs previous period)

### 3. **Feedback Management**
- Search feedback by driver or content
- View detailed feedback
- Star ratings (1-5 stars)
- Sentiment indicators (😊 😐 😞)
- Category classification
- Date tracking

### 4. **Navigation**
- Responsive sidebar
- Mobile hamburger menu
- User profile
- Notifications
- MoveInSync logo in header

---

## 📱 Responsive Design

Works perfectly on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (640px+)
- 💻 Desktops (1024px+)

---

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm install` | Install/update dependencies |
| `npm update` | Update all packages |

---

## 🔧 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**Want to change logo?**
Update the logo URL in `src/components/Header.jsx`

**Want to modify colors?**
Edit `tailwind.config.js` theme.colors section

**Need to add API integration?**
Replace mock data in component files with API calls

---

## 📖 Additional Resources

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
- Recharts: https://recharts.org
- Lucide Icons: https://lucide.dev

---

## ✨ Features Included

✅ Responsive design
✅ Modern UI with Tailwind CSS
✅ Interactive charts with Recharts
✅ Beautiful icons from Lucide
✅ Mobile navigation
✅ Feedback search
✅ Sentiment analysis
✅ Real-time data display
✅ Modal for detailed view
✅ Professional styling

---

**Happy coding! 🎉**
