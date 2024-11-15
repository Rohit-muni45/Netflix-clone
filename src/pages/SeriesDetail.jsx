import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import tmdb, { imageURL } from '../api/tmdb';
import Row from '../components/Row';

export default function SeriesDetail() {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [similarSeries, setSimilarSeries] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoPath, setLogoPath] = useState(null);
  const [fullOverview, setFullOverview] = useState(false);

  useEffect(() => {
    const fetchSeriesDetails = async () => { 
      setLoading(true);
      try {
        const [seriesRes, similarRes, videosRes] = await Promise.all([
          tmdb.get(`/tv/${id}`),
          tmdb.get(`/tv/${id}/similar`),
          tmdb.get(`/tv/${id}/videos`),
        ]);

        setSeries(seriesRes.data);
        setSimilarSeries(similarRes.data.results);

        const logoResponse = await tmdb.get(`/tv/${id}/images`);
        const logo = logoResponse.data.logos.find(
          (image) => image.iso_639_1 === 'en' || !image.iso_639_1
        );
        setLogoPath(logo ? `${imageURL}${logo.file_path}` : null);

        const trailer = videosRes.data.results.find(
          (video) => video.type === 'Trailer'
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) {
        setError('Failed to fetch series details');
        console.error('Error fetching series details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSeriesDetails();
    }
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;
  if (!series) return null;

  const opts = {
    width: '100%',
    height: '400px',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  const toggleOverview = () => setFullOverview((prev) => !prev);

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="relative h-[85vh] sm:h-[100vh] xl:h-[100vh]">
        <img
          //src={`${imageURL}${series.backdrop_path}`}
          src={
            window.innerWidth < 768
              ? `${imageURL}${series.poster_path}`
              : `${imageURL}${series.backdrop_path}`
          }
          alt={series.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40" />

        <div className="absolute bottom-0 left-0 p-5">
          {logoPath && (
            <img
              src={logoPath}
              alt={`${series.title} logo`}
              className="w-60 mb-4 md:w-72 xl:w-70"
            />
          )}
          <h2 className="text-xl md:text-4xl font-bold mb-3">{series.name}</h2>
          <div className="flex items-center space-x-4 mb-4">
            <span>{series.first_air_date?.split('-')[0]} ||</span>
            <span>{series.number_of_seasons} Season{series.number_of_seasons > 1 ? 's' : ''} ||</span>
            <span className="flex px-1.5 py-0.5 rounded-md bg-red-600">{series.vote_average.toFixed(1)} ⭐</span>
          </div>
          {/* <p className="max-w-8xl text-lg">{series.overview}</p> */}
          <p className="max-w-8xl text-lg">
            {fullOverview? series.overview : `${series.overview.slice(0, 200)}...`}
            <button 
             onClick={toggleOverview} 
             className="text-blue-500 underline ml-2 hover:text-blue-300">
              {fullOverview ? 'Read Less' : 'Read More'}
            </button>
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {series.genres?.map((genre) => (
              <span key={genre.id} className="px-3 py-1 bg-red-600 rounded-full text-sm">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {trailerKey && (
        <div className="mt-10 mx-5">
          <h2 className="text-3xl font-bold mb-4">Videos (Trailer)</h2>
          <div className="flex justify-left">
            <div className="w-full sm:w-2/3 lg:w-1/2 xl:w-2/5">
              <YouTube videoId={trailerKey} opts={opts} className="rounded-lg " />
            </div>
          </div>
        </div>
      )}

      {/* Similar Series Section */}
      {similarSeries.length > 0 && (
        <div className="mt-8">
          <Row title="Similar Series" items={similarSeries} type="tv" />
        </div>
      )}
    </div>
  );
}
