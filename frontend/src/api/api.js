import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/travelogue-backend';

const client = axios.create({
baseURL: API_BASE,
timeout: 20000,
});

export const searchFlights = (params) => client.get('/flights.php', { params });
export const searchHotels = (params) => client.get('/hotels.php', { params });
export const searchMaps = (params) => client.get('/maps.php', { params });
export const searchItinerary = (params) => client.get('/itinerary.php', { params });

export default client;