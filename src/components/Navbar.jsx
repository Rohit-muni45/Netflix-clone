import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useAppContext } from '../context/Context';


export default function Navbar() {
  const { searchQuery, setSearchQuery, handleSearch } = useAppContext();
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      navigate(`/search/${searchQuery}`);
      setSearchQuery('');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-10 px-4 py-0  transition-all duration-300 ${
        scroll ? 'bg-black bg-opacity-80' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto  flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/7500/Netflix_Logo_RGB-512.png"
            alt="Netflix Logo"
            className="w-34 h-24"
          />
        </Link>

        {/* Links - Hidden on small and medium screens */}
        <div className="hidden lg:flex mx-auto space-x-8">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/movies" className="text-white hover:text-gray-300">Movies</Link>
          <Link to="/shows" className="text-white hover:text-gray-300">TV Shows</Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex items-center ml-auto lg:ml-0">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-gray-800 text-white px-2 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </nav>
  );
}
