import axios from 'axios';
import { getCache, setCache } from '../utils/cache';

const AI_TOKEN = import.meta.env.VITE_AI_TOKEN;

/**
 * Fetch current ISS Location
 */
export const fetchISSLocation = async () => {
  try {
    const isProd = import.meta.env.PROD;
    const url = isProd ? '/api/iss-now' : 'http://api.open-notify.org/iss-now.json';
    const response = await axios.get(url);
    if (response.data.message === 'success') {
      return {
        lat: parseFloat(response.data.iss_position.latitude),
        lon: parseFloat(response.data.iss_position.longitude),
        timestamp: response.data.timestamp * 1000 // Convert to milliseconds
      };
    }
    throw new Error('Failed to fetch ISS location');
  } catch (error) {
    console.error('API Error (fetchISSLocation):', error);
    throw error;
  }
};

/**
 * Fetch Astronauts currently in space
 */
export const fetchAstronauts = async () => {
  try {
    const isProd = import.meta.env.PROD;
    const url = isProd ? '/api/astros' : 'http://api.open-notify.org/astros.json';
    const response = await axios.get(url);
    if (response.data.message === 'success') {
      return {
        count: response.data.number,
        people: response.data.people
      };
    }
    throw new Error('Failed to fetch Astronauts');
  } catch (error) {
    console.error('API Error (fetchAstronauts):', error);
    throw error;
  }
};

/**
 * Fetch nearest place name using OpenStreetMap Reverse Geocoding
 */
export const fetchNearestPlace = async (lat, lon) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat: lat,
        lon: lon,
        zoom: 10,
        addressdetails: 1
      },
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (response.data && response.data.address) {
      const addr = response.data.address;
      return addr.city || addr.town || addr.village || addr.county || addr.state || addr.country || 'Unknown Location';
    } else if (response.data && response.data.error) {
      return 'Over Ocean';
    }
    return 'Over Ocean';
  } catch (error) {
    console.error('API Error (fetchNearestPlace):', error);
    return 'Over Ocean';
  }
};

const FALLBACK_NEWS = [
  {
    title: "NASA's James Webb Space Telescope Unveils Stunning New Images of Deep Space",
    description: "The James Webb Space Telescope has captured unprecedented details of distant galaxies and star-forming regions, providing astronomers with new insights into the early universe.",
    author: "NASA Science Team",
    published: "2026-05-08 12:00:00 +0000",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    url: "https://www.nasa.gov"
  },
  {
    title: "SpaceX Starship Successfully Completes Its Most Ambitious Orbital Flight Test",
    description: "SpaceX's Starship spacecraft launched from Starbase, demonstrating successful stage separation, hot-staging mechanics, and a controlled splashdown in the Indian Ocean.",
    author: "SpaceX Communications",
    published: "2026-05-08 10:30:00 +0000",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60",
    url: "https://www.spacex.com"
  },
  {
    title: "International Space Station Conducts Vital Scientific Experiments in Microgravity",
    description: "Astronauts aboard the ISS completed a series of advanced biology and physics studies, paving the way for long-duration human spaceflight to Mars.",
    author: "ESA Space Operations",
    published: "2026-05-07 15:45:00 +0000",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
    url: "https://www.esa.int"
  },
  {
    title: "New Mars Rover Discovers Organic Molecules in Jezero Crater Lakebed",
    description: "Scientists analyzing data from the Perseverance rover have confirmed the detection of diverse organic compounds, hinting at past habitable conditions on the Red Planet.",
    author: "JPL News",
    published: "2026-05-07 08:15:00 +0000",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=60",
    url: "https://mars.nasa.gov"
  },
  {
    title: "Commercial Space Station Construction Accelerates to Meet Post-ISS Era Demands",
    description: "Axiom Space and Orbital Reef announce major manufacturing milestones for the next generation of habitable low-Earth orbit research facilities.",
    author: "Axiom Space",
    published: "2026-05-06 14:20:00 +0000",
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800&auto=format&fit=crop&q=60",
    url: "https://www.axiomspace.com"
  },
  {
    title: "Astronomers Detect Strongest Magnetic Field Ever Recorded in a Nearby Magnetar",
    description: "Using advanced orbiting X-ray observatories, researchers have measured an ultra-dense star's magnetic field, challenging existing stellar evolution models.",
    author: "Nature Astronomy",
    published: "2026-05-06 09:00:00 +0000",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=60",
    url: "https://www.nature.com"
  }
];

/**
 * Fetch Top Headlines from NewsAPI with caching
 */
export const fetchNews = async () => {
  const CACHE_KEY = 'top_headlines';
  const cachedNews = getCache(CACHE_KEY);
  
  if (cachedNews) {
    return cachedNews;
  }

  const apiKey = import.meta.env.VITE_NEWS_API_KEY?.trim();

  if (!apiKey) {
    console.warn('News API key is missing. Falling back to pre-configured space headlines.');
    setCache(CACHE_KEY, FALLBACK_NEWS, 15);
    return FALLBACK_NEWS;
  }

  try {
    const response = await axios.get('https://api.currentsapi.services/v1/latest-news', {
      params: { apiKey }
    });

    if (response.data && response.data.news && response.data.news.length > 0) {
      const articles = response.data.news;
      setCache(CACHE_KEY, articles, 15); // Cache for 15 minutes
      return articles;
    }
    
    if (response.data && response.data.status === '401') {
      console.warn('Currents API Key is invalid. Gracefully falling back to space headlines.');
      setCache(CACHE_KEY, FALLBACK_NEWS, 15);
      return FALLBACK_NEWS;
    }

    throw new Error(response.data.message || 'Failed to fetch news');
  } catch (error) {
    console.warn('API Error (fetchNews) - Gracefully falling back to space headlines:', error);
    setCache(CACHE_KEY, FALLBACK_NEWS, 15);
    return FALLBACK_NEWS;
  }
};

/**
 * Chat with Hugging Face Inference API (Mistral 7B)
 */
export const chatWithMistral = async (prompt, systemContext) => {
  if (!AI_TOKEN) {
    throw new Error('AI Token is missing. Please set VITE_AI_TOKEN.');
  }

  // Constructing a prompt format that Mistral-Instruct expects
  // <s>[INST] {system_prompt} {user_message} [/INST]
  const fullPrompt = `<s>[INST] ${systemContext}\n\nUser: ${prompt} [/INST]`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.1, // Keep it factual and deterministic based on context
          return_full_text: false,
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${AI_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.length > 0 && response.data[0].generated_text) {
      let reply = response.data[0].generated_text.trim();
      return reply;
    }
    throw new Error('Invalid response from AI model');
  } catch (error) {
    console.error('API Error (chatWithMistral):', error);
    throw error;
  }
};
