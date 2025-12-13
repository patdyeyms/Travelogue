import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

/* Custom marker icon */
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.5/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 16, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

function TripMap({ trip, sidebarSelection, selectedSidebarPlace }) {
  const [places, setPlaces] = useState([]);
  const markerRefs = useRef({});

  useEffect(() => {
    if (!trip) return;

    const fetchPlaces = async () => {
      try {
        let query = "tourist attraction";

        if (sidebarSelection.type === "restaurants") query = "restaurant";
        if (sidebarSelection.type === "hotels") query = "hotel";

        const res = await axios.get("http://localhost:5000/api/search-places", {
          params: {
            lat: trip.coords[0],
            lng: trip.coords[1],
            query,
          },
        });

        const validPlaces = (res.data.local_results || []).filter(
          p => p.gps_coordinates?.latitude && p.gps_coordinates?.longitude
        );

        setPlaces(validPlaces);
      } catch (err) {
        console.error(err);
        setPlaces([]);
      }
    };

    fetchPlaces();
  }, [trip, sidebarSelection]);


  /* Open popup when sidebar item is clicked */
  useEffect(() => {
    if (!selectedSidebarPlace) return;

    const key = selectedSidebarPlace.name;
    markerRefs.current[key]?.openPopup();
  }, [selectedSidebarPlace]);

  if (!trip) return null;

  const markers = places.map(p => ({
    name: p.name || p.title,
    coords: [p.gps_coordinates.latitude, p.gps_coordinates.longitude],
    rating: p.rating,
    address: p.address,
    order_online: p.order_online,
  }));


  return (
    <MapContainer
      center={trip.coords}
      zoom={14}
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((place, i) => (
        <Marker
          key={i}
          position={place.coords}
          icon={customIcon}
          ref={ref => (markerRefs.current[place.name] = ref)}
        >
          <Popup>
            <strong>{place.name}</strong>
            {place.rating && <p>⭐ {place.rating}</p>}
            {place.address && <p>{place.address}</p>}
            {place.order_online && (
              <a href={place.order_online} target="_blank" rel="noreferrer">
                Order Online
              </a>
            )}
          </Popup>
        </Marker>
      ))}

      {selectedSidebarPlace && <FlyTo coords={selectedSidebarPlace.coords} />}
    </MapContainer>
  );
}

export default TripMap;
