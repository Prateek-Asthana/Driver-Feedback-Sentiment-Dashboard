# Driver Feedback & Sentiment Dashboard

A full-stack React application for collecting employee feedback and providing real-time analytics for administrators.

## Features

- **Employee Feedback Form**: Configurable multi-entity feedback with feature flags
- **Admin Dashboard**: Real-time sentiment analytics and driver performance tracking
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Performance**: Optimized with code splitting, caching, and virtualization

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query) + Context API
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library + fast-check (property-based testing)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── api/            # API client and endpoints
└── test/           # Test utilities and setup
```

## Architecture

The application follows a component-based architecture with clear separation between:
- **Presentational components**: Pure UI components
- **Container components**: Components with business logic
- **Custom hooks**: Reusable logic and API integrations
- **Utilities**: Pure functions for calculations and transformations

## Design System

The application uses a consistent design system with:
- Color tokens for brand, sentiment, and semantic colors
- Typography scale with Inter font family
- Spacing scale (4px, 8px, 16px, 24px, 32px, etc.)
- Consistent border radius and shadow tokens

## License

MIT
