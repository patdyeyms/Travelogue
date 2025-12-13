// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/flights", async (req, res) => {
  const { departure_id, arrival_id, outbound_date, return_date } = req.query;

  // Determine type
  const type = return_date ? 1 : 2; // 1 = Round-trip, 2 = One-way

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_flights",
        type,
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
        travel_class: req.query.travel_class,
        adults: req.query.adults,
        children: req.query.children,
        infants_in_seat: req.query.infants_in_seat,
        airlines: req.query.airlines || undefined,
        nonstop: req.query.nonstop ? "true" : undefined,
        currency: "PHP",
        api_key: process.env.SERPAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

app.get("/api/hotels", async (req, res) => {
  const { q } = req.query; // city name

  if (!q) {
    return res.status(400).json({ error: "Query 'q' is required" });
  }

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "tripadvisor",
        q,
        api_key: process.env.SERPAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("TripAdvisor API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

app.get("/api/search-places", async (req, res) => {
  const { lat, lng, query } = req.query;

  if (!lat || !lng || !query) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_maps",
        q: query,
        ll: `@${lat},${lng},15.1z`,
        type: "search",
        api_key: process.env.SERPAPI_KEY, 
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching places:", error.message);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// TripAdvisor dynamic search
app.get("/api/tripadvisor", async (req, res) => {
  const { q, type } = req.query; // q = city, type = a/r/h (attractions/restaurants/hotels)

  if (!q || !type) return res.status(400).json({ error: "Query 'q' and 'type' are required" });

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "tripadvisor",
        q,
        ssrc: type, // a = attractions, r = restaurants, h = hotels
        api_key: process.env.SERPAPI_KEY,
      },
    });

    res.json(response.data.locations || []);
  } catch (err) {
    console.error("TripAdvisor API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch TripAdvisor data" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
