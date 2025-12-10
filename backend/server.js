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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
