import { createContext, useContext, useState, useCallback } from 'react';
import tmdb from '../api/tmdb';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);


  const addToWatchlist = (item) => {
    setWatchlist((prev) => {
      return prev.some((movie) => movie.id === item.id)
        ? prev.filter((movie) => movie.id !== item.id) // Remove if already added
        : [...prev, item]; // Add if not in the list
    });
  };


  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return; 

    setLoading(true);
    setError(null);

    try {
      const response = await tmdb.get('/search/multi', {
        params: { query}
        
      });
      setSearchResults(response.data);
      //console.log(response.data);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  const value = {
    searchQuery,
    searchResults,
    loading,
    error,
    watchlist,
    addToWatchlist,
    setSearchQuery,
    handleSearch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}