import { useEffect, useState } from 'react';
import { useAppContext } from '../context/Context';
import Banner from '../components/Banner';
import Row from '../components/Row';
import tmdb from '../api/tmdb';

export default function Home() {
  const { loading, error } = useAppContext();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [netflixOriginals, setNetflixOriginals] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [indianMovies, setIndianMovies] = useState([]);


  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [trendingRes, topRatedRes, showsRes, netflixOriginalsRes, indianMoviesRes] = await Promise.all([
          tmdb.get('/trending/movie/week'),
          tmdb.get('/movie/top_rated'),
          tmdb.get('/tv/popular'),
          tmdb.get('/discover/tv?with_networks=213'),
          tmdb.get('/discover/movie?with_original_language=te'),
        ]);

        setTrendingMovies(trendingRes.data.results);
        setTopRatedMovies(topRatedRes.data.results);
        setPopularShows(showsRes.data.results);
        setNetflixOriginals(netflixOriginalsRes.data.results);
        setIndianMovies(indianMoviesRes.data.results);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };

    fetchHomeData();
  }, []);

  if (loading)
    return <div className="text-white text-center mt-20">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <div className="bg-black min-h-screen">
      <Banner />
      <div className="mt-4 space-y-8">
        <Row title="Trending Now" items={trendingMovies} type="movie" posterSize={true} />
        <Row title="Top Rated Movies" items={topRatedMovies} type="movie" />
        <Row title="Popular TV Shows" items={popularShows} type="tv" />
        <Row title="Netflix Originals" items={netflixOriginals} type="tv" />
        <Row title="Indian Movies" items={indianMovies} type="movie" />
      </div>
    </div>
  );
}
