/**
 * Mock data for the dashboard
 * In production, this would come from backend API
 */

// Sample drivers data
export const mockDrivers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@moveinsync.com',
    totalTrips: 2450,
    averageScore: 4.8,
    trend: { direction: 'up', value: 0.3 }, // vs last week
    status: 'active',
    alertThreshold: 3.5,
    isBelowThreshold: false,
    recentFeedback: [
      {
        id: 101,
        entity: 'driver',
        sentiment: 'positive',
        score: 5,
        tags: ['Very Polite', 'Professional'],
        text: 'Excellent driver, very courteous and professional.',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 102,
        entity: 'driver',
        sentiment: 'positive',
        score: 5,
        tags: ['Good Route', 'On Time'],
        text: 'Perfect journey, arrived exactly on time.',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya@moveinsync.com',
    totalTrips: 2100,
    averageScore: 4.7,
    trend: { direction: 'up', value: 0.2 },
    status: 'active',
    alertThreshold: 3.5,
    isBelowThreshold: false,
    recentFeedback: [
      {
        id: 201,
        entity: 'driver',
        sentiment: 'positive',
        score: 5,
        tags: ['Safe Driving', 'Helpful'],
        text: 'Great driver, very safe and helpful with luggage.',
        date: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 3,
    name: 'Vikram Singh',
    email: 'vikram@moveinsync.com',
    totalTrips: 1850,
    averageScore: 2.3,
    trend: { direction: 'down', value: -0.5 },
    status: 'flagged',
    alertThreshold: 3.5,
    isBelowThreshold: true,
    recentFeedback: [
      {
        id: 301,
        entity: 'driver',
        sentiment: 'negative',
        score: 2,
        tags: ['Rash Driving'],
        text: 'Driver was reckless and drove too fast.',
        date: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 4,
    name: 'Amit Patel',
    email: 'amit@moveinsync.com',
    totalTrips: 2200,
    averageScore: 4.6,
    trend: { direction: 'up', value: 0.1 },
    status: 'active',
    alertThreshold: 3.5,
    isBelowThreshold: false,
    recentFeedback: [],
  },
  {
    id: 5,
    name: 'Neha Sharma',
    email: 'neha@moveinsync.com',
    totalTrips: 1920,
    averageScore: 4.5,
    trend: { direction: 'flat', value: 0 },
    status: 'active',
    alertThreshold: 3.5,
    isBelowThreshold: false,
    recentFeedback: [],
  },
];

// Sample feedback data (chronological)
export const mockFeedback = [
  {
    id: 401,
    driverId: 3,
    driverName: 'Vikram Singh',
    entity: 'driver',
    sentiment: 'negative',
    score: 2,
    tags: ['Rash Driving'],
    text: 'Driver was reckless and drove too fast late in the evening.',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 402,
    driverId: 1,
    driverName: 'Rajesh Kumar',
    entity: 'trip',
    sentiment: 'positive',
    score: 5,
    tags: ['On Time', 'Comfortable'],
    text: 'Trip was smooth and on time.',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 403,
    driverId: 2,
    driverName: 'Priya Singh',
    entity: 'driver',
    sentiment: 'positive',
    score: 5,
    tags: ['Safe Driving', 'Helpful'],
    text: 'Great driver, very safe and helpful.',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 404,
    driverId: 4,
    driverName: 'Amit Patel',
    entity: 'driver',
    sentiment: 'neutral',
    score: 3,
    tags: [],
    text: 'Average experience.',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 405,
    driverId: 1,
    driverName: 'Rajesh Kumar',
    entity: 'driver',
    sentiment: 'positive',
    score: 5,
    tags: ['Very Polite', 'Professional'],
    text: 'Excellent driver, very courteous and professional.',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
];

// Feedback tags per entity
export const mockFeedbackTags = {
  driver: [
    'Rash Driving',
    'Very Polite',
    'Professional',
    'Safe Driving',
    'Good Route',
    'Helpful',
    'On Time',
    'Late Arrival',
  ],
  trip: [
    'Punctuality',
    'Route Accuracy',
    'Comfortable',
    'Late Departure',
    'Smooth Ride',
  ],
  app: [
    'Easy to Use',
    'Fast',
    'Reliable',
    'Slow',
    'Crashes Often',
    'Good UX',
  ],
  marshal: [
    'Professional',
    'Helpful',
    'Safety Conscious',
    'Unprofessional',
    'Not Helpful',
  ],
};

// Feature flag config (from backend)
export const mockFeatureFlagConfig = {
  driverFeedback: true,
  tripFeedback: true,
  appFeedback: false,
  marshalFeedback: false,
};

// Sentiment summary aggregates
export const mockSentimentSummary = {
  today: { positive: 142, neutral: 45, negative: 23, total: 210 },
  week: { positive: 1050, neutral: 310, negative: 145, total: 1505 },
  month: { positive: 4320, neutral: 1280, negative: 621, total: 6221 },
  year: { positive: 52480, neutral: 15600, negative: 7820, total: 75900 },
};

// Weekly sentiment trend data (for chart)
export const mockWeeklySentimentTrend = [
  { day: 'Mon', positive: 140, neutral: 45, negative: 20 },
  { day: 'Tue', positive: 155, neutral: 40, negative: 25 },
  { day: 'Wed', positive: 165, neutral: 35, negative: 18 },
  { day: 'Thu', positive: 148, neutral: 50, negative: 22 },
  { day: 'Fri', positive: 180, neutral: 40, negative: 30 },
  { day: 'Sat', positive: 170, neutral: 55, negative: 15 },
  { day: 'Sun', positive: 92, neutral: 45, negative: 15 },
];

// Driver trend data (30 days sentiment average)
export const mockDriverTrendData = [
  { date: '2024-01-24', score: 4.7, positive: 85, neutral: 10, negative: 5 },
  { date: '2024-01-25', score: 4.8, positive: 88, neutral: 8, negative: 4 },
  { date: '2024-01-26', score: 4.75, positive: 86, neutral: 11, negative: 3 },
  { date: '2024-01-27', score: 4.82, positive: 89, neutral: 7, negative: 4 },
  { date: '2024-01-28', score: 4.73, positive: 84, neutral: 12, negative: 4 },
  { date: '2024-01-29', score: 4.79, positive: 87, neutral: 9, negative: 4 },
  { date: '2024-01-30', score: 4.8, positive: 88, neutral: 8, negative: 4 },
];
