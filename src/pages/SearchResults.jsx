import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import tmdb from '../api/tmdb';

export default function SearchResults() {
  const { query, page: routePage } = useParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Convert routePage to a number, or default to 1 if not available
  const page = routePage ? parseInt(routePage) : 1;

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await tmdb.get('/search/multi', {
          params: { query, page },
        });
        setSearchResults(response.data.results);
        setTotalPages(response.data.total_pages); // Save the total number of pages
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const handlePageChange = (newPage) => {
    navigate(`/search/${query}/${newPage}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='container mx-auto mt-6 px-4 py-6 pt-20'>
      <h2 className="text-left text-white text-2xl mt-4 mb-8">Search Results {query ? `for "${query}"` : ''}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {searchResults.length > 0 ? (
          searchResults
            //.filter((result) => result.poster_path)
            .map((result) => (
              <Link
                key={result.id}
                to={result.media_type === 'movie' ? `/movie/${result.id}` : `/tv/${result.id}`}
                className="transition-transform hover:scale-105"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-full h-[300px] lg:h-[350px] object-cover rounded-lg"
                />
                <h2 className="text-white mt-2 text-center">{result.title || result.name}</h2>
              </Link>
            ))
        ) : (
          <p className="text-center text-gray-400">No results found for "{query}"</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className='text-gray-400 flex items-center' >
          {`Page ${page} of ${totalPages}`}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
