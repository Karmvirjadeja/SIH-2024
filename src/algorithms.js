import { findMaritimeRoute } from "./maritimeData";

// Dummy data for ports
const ports = {
  Mumbai: { lat: 18.975, lng: 72.8258 },
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Dubai: { lat: 25.276987, lng: 55.296249 },
};

// Dummy algorithm to calculate a route
function calculateRoute(start, end, weatherImpact) {
  const startCoords = [ports[start].lat, ports[start].lng];
  const endCoords = [ports[end].lat, ports[end].lng];

  // Use maritime route finder
  const route = findMaritimeRoute(startCoords, endCoords);

  if (route.length === 0) {
    return { error: "No valid maritime route found." };
  }

  // Dummy calculation for demonstration
  const distance = Math.sqrt(
    Math.pow(route[1][0] - route[0][0], 2) +
      Math.pow(route[1][1] - route[0][1], 2)
  ).toFixed(2);

  const fuelConsumption = (distance * 0.1).toFixed(2); // Example constant for fuel consumption
  const travelTime = (distance / 10).toFixed(2); // Example speed of 10 units per hour
  const safetyScore = (100 - weatherImpact).toFixed(2); // Safety decreases with more weather impact

  return {
    route,
    distance,
    fuelConsumption,
    travelTime,
    safetyScore,
  };
}

export { calculateRoute, ports };
