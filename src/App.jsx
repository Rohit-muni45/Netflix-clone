import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Shows from './pages/Shows';
import MovieDetail from './pages/MovieDetail';
import { AppProvider } from './context/Context';
import SeriesDetail from './pages/SeriesDetail';
import SearchResults from './pages/SearchResults';

function App() { 
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-black">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path='/movies/page/:page' element={<Movies />} />
              <Route path='/movies/genre/:genre/page/:page' element={<Movies />} />
              <Route path="/shows" element={<Shows />} />
              <Route path='/shows/page/:page' element={<Shows />} />
              <Route path='/shows/genre/:genre/page/:page' element={<Shows />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="tv/:id" element={<SeriesDetail/>} />
              <Route path='/search/:query' element={<SearchResults/>}/>
              <Route path='/search/:query/:page' element={<SearchResults/>}/>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
