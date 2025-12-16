import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom marker icons with colors
const createCustomIcon = (color = "#28a1a1", iconType = "📍") => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #fff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 20px;
        ">${iconType}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Different icons for different place types
const MARKER_CONFIGS = {
  destination: { color: "#28a1a1", icon: "🏙️" },
  attractions: { color: "#f59e0b", icon: "🎭" },
  restaurants: { color: "#ef4444", icon: "🍽️" },
  hotels: { color: "#8b5cf6", icon: "🏨" },
  selected: { color: "#10b981", icon: "📍" },
};

function TripMap({ trip, sidebarSelection, selectedSidebarPlace }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!trip || !mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: trip.coords,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add tile layer with better styling
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const map = mapInstanceRef.current;

    // Add main destination marker
    const mainConfig = MARKER_CONFIGS.destination;
    const mainMarker = L.marker(trip.coords, {
      icon: createCustomIcon(mainConfig.color, mainConfig.icon),
    }).addTo(map);

    const destinationName = trip.name || "Destination";
    mainMarker.bindPopup(`
      <div style="
        font-family: 'Poppins', sans-serif;
        padding: 8px;
        min-width: 150px;
        background: #fff;
      ">
        <h3 style="
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #0b3a3a;
        ">${destinationName}</h3>
        <p style="
          margin: 0;
          font-size: 14px;
          color: #666;
        ">📍 Main Destination</p>
      </div>
    `);

    markersRef.current.push(mainMarker);

    // Add default attractions if no sidebar places
    if (!selectedSidebarPlace && trip.attractions) {
      trip.attractions.forEach((attraction) => {
        const config = MARKER_CONFIGS.attractions;
        const marker = L.marker(attraction.coords, {
          icon: createCustomIcon(config.color, config.icon),
        }).addTo(map);

        marker.bindPopup(`
          <div style="
            font-family: 'Poppins', sans-serif;
            padding: 8px;
            min-width: 180px;
            background: #fff;
          ">
            <h3 style="
              margin: 0 0 8px 0;
              font-size: 15px;
              font-weight: 600;
              color: #0b3a3a;
            ">${attraction.name}</h3>
            <p style="
              margin: 0;
              font-size: 13px;
              color: #666;
            ">🎭 Popular Attraction</p>
          </div>
        `);

        markersRef.current.push(marker);
      });
    }

    // Add selected place marker
    if (selectedSidebarPlace && selectedSidebarPlace.coords) {
      const config = MARKER_CONFIGS[sidebarSelection?.type] || MARKER_CONFIGS.selected;
      const selectedMarker = L.marker(selectedSidebarPlace.coords, {
        icon: createCustomIcon(config.color, config.icon),
      }).addTo(map);

      // Create detailed popup content
      let popupContent = `
        <div style="
          font-family: 'Poppins', sans-serif;
          padding: 10px;
          min-width: 200px;
          max-width: 250px;
          background: #fff;
        ">
          <h3 style="
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
            color: #0b3a3a;
            line-height: 1.4;
          ">${selectedSidebarPlace.name}</h3>
      `;

      if (selectedSidebarPlace.rating) {
        popupContent += `
          <p style="
            margin: 0 0 6px 0;
            font-size: 14px;
            color: #f59e0b;
            font-weight: 500;
          ">⭐ ${selectedSidebarPlace.rating}</p>
        `;
      }

      if (selectedSidebarPlace.address) {
        popupContent += `
          <p style="
            margin: 0 0 6px 0;
            font-size: 13px;
            color: #666;
            line-height: 1.4;
          ">📍 ${selectedSidebarPlace.address}</p>
        `;
      }

      // Add type badge
      const typeLabels = {
        attractions: "Tourist Attraction",
        restaurants: "Restaurant",
        hotels: "Hotel",
      };
      const typeLabel = typeLabels[sidebarSelection?.type] || "Place";
      
      popupContent += `
        <div style="
          margin-top: 8px;
          padding: 4px 10px;
          background: ${config.color};
          color: #fff;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
        ">${config.icon} ${typeLabel}</div>
      `;

      if (selectedSidebarPlace.order_online) {
        popupContent += `
          <a href="${selectedSidebarPlace.order_online}" 
             target="_blank" 
             rel="noopener noreferrer"
             style="
               display: block;
               margin-top: 10px;
               padding: 8px 12px;
               background: linear-gradient(135deg, #28a1a1, #5cd6d6);
               color: #fff;
               text-decoration: none;
               border-radius: 8px;
               text-align: center;
               font-size: 13px;
               font-weight: 600;
             ">
            View Details →
          </a>
        `;
      }

      popupContent += `</div>`;

      selectedMarker.bindPopup(popupContent, {
        maxWidth: 300,
        className: "custom-popup",
      }).openPopup();

      markersRef.current.push(selectedMarker);

      // Center map on selected place with animation
      map.flyTo(selectedSidebarPlace.coords, 15, {
        duration: 1.5,
        easeLinearity: 0.5,
      });
    } else {
      // Fit bounds to show all markers
      if (markersRef.current.length > 1) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.1), {
          maxZoom: 14,
          animate: true,
          duration: 1,
        });
      } else {
        map.setView(trip.coords, 13);
      }
    }

    // Cleanup function
    return () => {
      // Don't destroy map, just clear markers
      // Map will be reused for better performance
    };
  }, [trip, sidebarSelection, selectedSidebarPlace]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="map-view"
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "16px",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
}

export default React.memo(TripMap);