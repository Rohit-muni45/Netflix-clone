import axios from 'axios';
import.meta.env.VITE_API_KEY


const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const baseURL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL,
  params: {
    api_key: VITE_API_KEY,
  },
});

export const imageURL = 'https://image.tmdb.org/t/p/original';
export default tmdb;