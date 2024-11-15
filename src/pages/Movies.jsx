import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import tmdb, { imageURL } from '../api/tmdb';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  //const [selectedGenre, setSelectedGenre] = useState('');
  const { genre, page } = useParams();
  //const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const currentPage = parseInt(page) || 1;
  const selectedGenre = genre || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await tmdb.get('/genre/movie/list');
      setGenres(response.data.genres);
    };
    fetchGenres();  
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const params = {
        page: currentPage,
        with_genres: selectedGenre,
      };

      const response = await tmdb.get('/discover/movie', { params });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    };
    fetchMovies();
    window.scrollTo(0, 0);
  }, [currentPage, selectedGenre]);

  const handlePageChange = (newPage) => {
    navigate(`/movies${selectedGenre ? `/genre/${selectedGenre}` : ''}/page/${newPage}`);
  };

  const handleGenreChange = (genreId) => {
    navigate(`/movies${genreId ? `/genre/${genreId}` : ''}/page/1`);
  };


  return (
    <div className="bg-black min-h-screen pt-20 px-4 mt-8">
      <div className="container mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">Movies</h1>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreChange('')}
            className={`px-4 py-2 rounded ${
              selectedGenre === '' ? 'bg-red-600' : 'bg-gray-700'
            } text-white`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreChange(genre.id)}
              className={`px-4 py-2 rounded ${
                selectedGenre == genre.id ? 'bg-red-600' : 'bg-gray-700'
              } text-white`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="transition-transform hover:scale-105"
            >
              <img
                src={`${imageURL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-[350px] object-cover rounded-lg"
              />
              <h2 className="text-white mt-2 text-center">{movie.title}</h2>
            </Link>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-red-700 text-white rounded disabled:opacity-50"
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

export default Movies;
