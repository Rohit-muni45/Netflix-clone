import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { imageURL } from '../api/tmdb';


export default function Row({ title, items, type = 'movie', posterSize = false }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group py-4">
      <h2 className="text-white text-2xl font-bold px-4 mb-4">{title}</h2>
      
      <div className="absolute top-[50%] -left-4 z-10 hidden group-hover:block">
        <button
          onClick={() => scroll('left')}
          className="bg-black/50 p-2 rounded-full hover:bg-black/80"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div
        ref={rowRef}
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth px-4 space-x-4"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/${type}/${item.id}`}
            className={`flex-none transition-transform hover:scale-105 ${
              posterSize ? 'w-[200px]' : 'w-[250px]'
            }`}
          >
            <img
              src={`${imageURL}${posterSize ? item.poster_path : item.backdrop_path}`}
              alt={item.title || item.name}
              className={`rounded-lg w-full object-cover ${
                posterSize ? 'h-[300px]' : 'h-[150px]'
              }`}
            />
            <p className="text-white mt-2 text-center truncate">
              {item.title || item.name}
            </p>
          </Link>
        ))}
      </div>

      <div className="absolute top-[50%] -right-4 z-10 hidden group-hover:block">
        <button
          onClick={() => scroll('right')}
          className="bg-black/50 p-2 rounded-full hover:bg-black/80"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}