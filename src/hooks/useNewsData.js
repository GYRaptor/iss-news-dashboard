import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/api';

export const useNewsData = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews();
      setArticles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load news articles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return { articles, loading, error, refreshNews: loadNews };
};
