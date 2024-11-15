import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import tmdb, { imageURL } from '../api/tmdb';

export default function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBannerMovies = async () => {
      try {
        const response = await tmdb.get('/discover/movie?with_original_language=te|ml|kn');
        setMovies(response.data.results);
      } catch (error) {
        console.error('Banner fetch error:', error);
      }
    };
    fetchBannerMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [movies, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative h-[85vh] w-full overflow-hidden lg:h-[105vh]">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Use poster for mobile view, backdrop for desktop view */}
          <img
            src={
              window.innerWidth < 768
                ? `${imageURL}${movie.poster_path}`
                : `${imageURL}${movie.backdrop_path}`
            }
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Content Overlay with Mobile Adjustment */}
      <div className="absolute bottom-10 left-4 md:left-4 z-10 max-w-2xs md:max-w-6xl lg:max-w-6xl  md:p-6 rounded md:rounded-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
          {currentMovie.title || currentMovie.name}
        </h1>
        <p className="text-sm md:text-lg text-white mb-4 line-clamp-3 md:line-clamp-none">
          {currentMovie.overview}
        </p>
        <Link
          to={`/movie/${currentMovie.id}`}
          className="bg-red-600 text-white px-4 py-2 md:px-6 md:py-2 rounded hover:bg-red-700 transition-colors"
        >
          Watch Now
        </Link>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30" />

      {/* Left and Right Arrows */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/80 z-10"
        onClick={handlePrev}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/80 z-10"
        onClick={handleNext}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}


      


