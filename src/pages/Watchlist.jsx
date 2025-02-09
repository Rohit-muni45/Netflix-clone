
import { useAppContext } from '../context/Context';
import { imageURL } from '../api/tmdb';
import { Link } from 'react-router-dom';

function Watchlist() {
  const { watchlist, addToWatchlist } = useAppContext();

  return (
    <div className="text-white mt-12 p-14 ">
      <h1 className="text-3xl font-bold mb-4">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>No movies or shows added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="relative">
              <Link to={item.title ? `/movie/${item.id}` : `/show/${item.id}`}>
                <img
                  src={`${imageURL}${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-70 object-cover rounded-lg"
                />
                <h2 className="mt-2 text-center">{item.title || item.name}</h2>
              </Link>
              <button
                onClick={() => addToWatchlist(item)}
                className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
