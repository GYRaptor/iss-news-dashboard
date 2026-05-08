# Real-Time ISS & News Dashboard

A production-ready, highly interactive dashboard that tracks the International Space Station (ISS) in real-time, displays live global news headlines, and features an AI chatbot integrated with Hugging Face's Mistral model to answer queries based on live telemetry and news data.

## Features

- **Live ISS Tracking**: Fetches ISS coordinates every 15 seconds, calculates real-time speed, displays current location (using OpenStreetMap reverse geocoding), and maps its recent trajectory using Leaflet.
- **Astronauts in Space**: Lists the number of people currently in space and their names.
- **Global News Dashboard**: Fetches top news from NewsAPI, allows search and sorting, and caches results to optimize API usage.
- **Data Visualizations**: Recharts integration showing a smooth line chart for velocity history and a doughnut chart for news source distribution.
- **Smart AI Chatbot**: A floating chatbot powered by Mistral 7B (Hugging Face) that uses a dynamic context prompt to answer user questions *only* based on the real-time data displayed on the dashboard.
- **Modern UI/UX**: Built with Tailwind CSS v4, supporting full responsiveness, dark/light mode persistence, and beautiful glassmorphism design.

## Prerequisites

- Node.js 18+
- [NewsAPI](https://newsapi.org/) Key
- [Hugging Face](https://huggingface.co/) Access Token

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_NEWS_API_KEY=your_newsapi_key_here
   VITE_AI_TOKEN=your_huggingface_token_here
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## Project Structure

```
src/
 ├── components/
 │    ├── charts/          # Recharts visualizations
 │    ├── chatbot/         # Floating chatbot UI
 │    ├── iss/             # Live tracking, map, and astronauts
 │    ├── news/            # News grid, cards, and filtering
 │    └── layout/          # Dashboard layout and Header
 ├── context/              # Theme and global Dashboard data context
 ├── hooks/                # Custom React hooks for data fetching
 ├── services/             # Axios API wrappers
 ├── utils/                # Caching, formatting, and haversine calculations
 ├── App.jsx               # Main application routing and context providers
 ├── main.jsx              # React entry point
 └── index.css             # Tailwind v4 configuration and global styles
```

## Technologies Used

- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Recharts
- React Leaflet + Leaflet
- Lucide React (Icons)
- React Hot Toast
