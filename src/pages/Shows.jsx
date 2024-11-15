import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import tmdb, { imageURL } from '../api/tmdb';

function Shows() {
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { page, genre } = useParams();
  const currentPage = parseInt(page) || 1;
  const selectedGenre = genre || '';

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      const response = await tmdb.get('/genre/tv/list');
      setGenres(response.data.genres);
      //console.log(response.data.genres);
    };
    fetchGenres(); 
  }, []);

  // Fetch shows based on page and genre
  useEffect(() => {
    const fetchShows = async () => {
      const params = {
        page: currentPage,
        with_genres: selectedGenre,
      };

      const response = await tmdb.get('/discover/tv', { params });
      setShows(response.data.results);
      setTotalPages(response.data.total_pages);
    };
    fetchShows();
    window.scrollTo(0, 0);
  }, [currentPage, selectedGenre]);

  // Update URL for page and genre changes
  const handlePageChange = (newPage) => {
    navigate(`/shows${selectedGenre ? `/genre/${selectedGenre}` : ''}/page/${newPage}`);
  };

  const handleGenreChange = (genreId) => {
    navigate(`/shows${genreId ? `/genre/${genreId}` : ''}/page/1`);
  };

  return (
    <div className="bg-black min-h-screen pt-20 px-4 mt-8">
      <div className="container mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">TV Shows</h1>

        {/* Genre Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreChange('')}
            className={`px-4 py-2 rounded ${selectedGenre === '' ? 'bg-red-600' : 'bg-gray-700'} text-white`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreChange(genre.id)}
              className={`px-4 py-2 rounded ${selectedGenre == genre.id ? 'bg-red-600' : 'bg-gray-700'} text-white`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Show Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {shows.map((show) => (
            <Link
              key={show.id}
              to={`/tv/${show.id}`}
              className="transition-transform hover:scale-105"
            >
              <img
                src={`${imageURL}${show.poster_path}`}
                alt={show.name}
                className="w-full h-[350px] object-cover rounded-lg md:h-[300px]"
              />
              <h2 className="text-white mt-2 text-center">{show.name}</h2>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-8 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-red-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Shows;

