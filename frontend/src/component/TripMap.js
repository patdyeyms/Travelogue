import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-shadow.png",
});

// Component to programmatically fly to coordinates
function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

function TripMap({ trip, sidebarSelection, selectedSidebarPlace }) {
  const [places, setPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);

  useEffect(() => {
    if (!trip || !sidebarSelection) return;

    const fetchPlaces = async () => {
      try {
        let query = "restaurant";
        if (sidebarSelection.type === "attractions") query = "tourist attraction";
        if (sidebarSelection.type === "hotels") query = "hotel";

        const response = await axios.get("http://localhost:5000/api/search-places", {
          params: {
            lat: trip.coords[0],
            lng: trip.coords[1],
            query,
          },
        });

        setPlaces(response.data.local_results || []);
      } catch (err) {
        console.error("Error fetching places:", err);
        setPlaces([]);
      }
    };

    fetchPlaces();
  }, [trip, sidebarSelection]);

  useEffect(() => {
    if (!selectedSidebarPlace) return;
    setActivePlace(selectedSidebarPlace);
  }, [selectedSidebarPlace]);

  if (!trip) return null;

  // Determine markers to render
  const markers =
    sidebarSelection.type === "attractions"
      ? trip.attractions.map((place) => ({
          name: place.name,
          coords: place.coords,
        }))
      : places.map((place) => ({
          name: place.name || place.title,
          coords: [place.gps_coordinates.latitude, place.gps_coordinates.longitude],
          rating: place.rating,
          address: place.address,
          order_online: place.order_online,
        }));

  return (
    <MapContainer
      center={[trip.coords[0], trip.coords[1]]}
      zoom={14}
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((place, i) => (
        <Marker
          key={i}
          position={place.coords}
          eventHandlers={{
            click: () => setActivePlace(place),
          }}
        >
          {activePlace === place && (
            <Popup onClose={() => setActivePlace(null)}>
              <strong>{place.name}</strong>
              {place.rating && <p>⭐ {place.rating}</p>}
              {place.address && <p>{place.address}</p>}
              {place.order_online && (
                <a href={place.order_online} target="_blank" rel="noopener noreferrer">
                  Order Online
                </a>
              )}
            </Popup>
          )}
        </Marker>
      ))}

      {activePlace && <FlyTo coords={activePlace.coords} />}
    </MapContainer>
  );
}

export default TripMap;
