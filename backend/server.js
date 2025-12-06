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

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_flights",
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
        adults: 1,
        travel_class: 1,
        currency: "PHP",
        api_key: process.env.SERPAPI_KEY, // store your key in .env
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
