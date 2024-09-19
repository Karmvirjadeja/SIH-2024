// maritimeData.js

// Example routes (with dummy coordinates for illustration)
const routes = {
  direct: [
    { lat: 13.0827, lng: 80.2707 }, // Chennai
    { lat: -31.9505, lng: 115.8605 }, // Perth
  ],
  viaSingapore: [
    { lat: 13.0827, lng: 80.2707 }, // Chennai
    { lat: 1.3521, lng: 103.8198 }, // Singapore
    { lat: -31.9505, lng: 115.8605 }, // Perth
  ],
  viaColombo: [
    { lat: 13.0827, lng: 80.2707 }, // Chennai
    { lat: 6.9271, lng: 79.8612 }, // Colombo
    { lat: -31.9505, lng: 115.8605 }, // Perth
  ],
};

// Dummy function to check if a point is over water
function isPointOverWater(lat, lng) {
  // For simplicity, let's assume all coordinates in the examples are over water
  // In a real application, integrate with a geospatial data service
  return true;
}

// Function to get route information
function getRouteInfo(routeType) {
  const route = routes[routeType] || [];
  const filteredRoute = route.filter((point) =>
    isPointOverWater(point.lat, point.lng)
  );

  switch (routeType) {
    case "direct":
      return {
        route: filteredRoute,
        distance: "Approximately 4,179 nautical miles",
        travelTime: "12-14 days",
        description:
          "Most straightforward route, affected by weather conditions.",
      };
    case "viaSingapore":
      return {
        route: filteredRoute,
        distance: "Approximately 4,700 nautical miles",
        travelTime: "14-16 days",
        description:
          "Includes a stop in Singapore, useful for refueling and cargo transfer.",
      };
    case "viaColombo":
      return {
        route: filteredRoute,
        distance: "Approximately 4,900 nautical miles",
        travelTime: "14-16 days",
        description:
          "Includes a stop in Colombo, offers various services and a convenient stopover.",
      };
    default:
      return { route: [], distance: "", travelTime: "", description: "" };
  }
}

export { getRouteInfo };
