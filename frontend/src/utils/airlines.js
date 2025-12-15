// Mapping of airline codes and names to logo file paths
const airlineLogos = {
  // Philippine Airlines
  'PR': '/logos/philippine-airlines.png',
  'Philippine Airlines': '/logos/philippine-airlines.png',
  
  // Cebu Pacific
  '5J': '/logos/cebu-pacific.png',
  'Cebu Pacific': '/logos/cebu-pacific.png',
  'Cebu Pacific Air': '/logos/cebu-pacific.png',
  
  // AirAsia
  'Z2': '/logos/airasia.png',
  'AirAsia': '/logos/airasia.png',
  'AirAsia Philippines': '/logos/airasia.png',
  
  // PAL Express
  '2P': '/logos/pal-express.png',
  'PAL Express': '/logos/pal-express.png',
  
  // Cebgo
  'DG': '/logos/cebgo.png',
  'Cebgo': '/logos/cebgo.png',
  
  // Add more airlines as needed
  // International carriers
  'CX': '/logos/cathay-pacific.png',
  'Cathay Pacific': '/logos/cathay-pacific.png',
  
  'SQ': '/logos/singapore-airlines.png',
  'Singapore Airlines': '/logos/singapore-airlines.png',
  
  'KE': '/logos/korean-air.png',
  'Korean Air': '/logos/korean-air.png',
  
  'NH': '/logos/ana.png',
  'All Nippon Airways': '/logos/ana.png',
  'ANA': '/logos/ana.png',
};

export const getAirlineLogo = (airlineIdentifier) => {
  if (!airlineIdentifier) {
    return process.env.PUBLIC_URL + '/logos/default-airline.png';
  }

  // Clean the input
  const cleanIdentifier = airlineIdentifier.trim();

  // Check if we have an exact match (code or name)
  if (airlineLogos[cleanIdentifier]) {
    return process.env.PUBLIC_URL + airlineLogos[cleanIdentifier];
  }

  // Try case-insensitive match
  const matchedKey = Object.keys(airlineLogos).find(
    key => key.toLowerCase() === cleanIdentifier.toLowerCase()
  );

  if (matchedKey) {
    return process.env.PUBLIC_URL + airlineLogos[matchedKey];
  }

  // Fallback: convert identifier to filename format
  const filename = cleanIdentifier
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return process.env.PUBLIC_URL + `/logos/${filename}.png`;
};

// Helper to get airline name from code
export const getAirlineName = (code) => {
  const codeToName = {
    'PR': 'Philippine Airlines',
    '5J': 'Cebu Pacific',
    'Z2': 'AirAsia Philippines',
    '2P': 'PAL Express',
    'DG': 'Cebgo',
    'CX': 'Cathay Pacific',
    'SQ': 'Singapore Airlines',
    'KE': 'Korean Air',
    'NH': 'ANA',
  };
  return codeToName[code] || code;
};

// Optional: Export the list of supported airlines
export const getSupportedAirlines = () => {
  const uniqueLogos = new Set(Object.values(airlineLogos));
  return Array.from(uniqueLogos);
};