import axios from 'axios';
import { getCache, setCache } from '../utils/cache';

const AI_TOKEN = import.meta.env.VITE_AI_TOKEN;

/**
 * Fetch current ISS Location
 */
export const fetchISSLocation = async () => {
  try {
    const response = await axios.get('http://api.open-notify.org/iss-now.json');
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
    const response = await axios.get('http://api.open-notify.org/astros.json');
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
    throw new Error('News API key is missing. Please set VITE_NEWS_API_KEY.');
  }

  try {
    const response = await axios.get('https://api.currentsapi.services/v1/latest-news', {
      params: { apiKey }
    });

    if (response.data && response.data.news) {
      const articles = response.data.news;
      setCache(CACHE_KEY, articles, 15); // Cache for 15 minutes
      return articles;
    }
    throw new Error(response.data.message || 'Failed to fetch news');
  } catch (error) {
    console.error('API Error (fetchNews):', error);
    const currentsError = error.response?.data?.msg || error.response?.data?.message || error.response?.data?.error;
    const errorMessage = currentsError || error.message || 'Failed to fetch news';
    throw new Error(errorMessage);
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
