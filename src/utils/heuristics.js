/**
 * Calculate Euclidean distance (in meters)
 * Formula: √((Δlon_m)² + (Δlat_m)²)
 * 
 * @param {Object} node1 - First node with Longitude and Latitude
 * @param {Object} node2 - Second node with Longitude and Latitude
 * @returns {number} Euclidean distance in meters
 */
export const euclideanDistance = (node1, node2) => {
  const R = 6371000; // Earth radius (m)
  const lat1 = node1.Latitude * Math.PI / 180;
  const lat2 = node2.Latitude * Math.PI / 180;

  // Convert degree difference to meters
  const dx = (node2.Longitude - node1.Longitude) * (Math.PI / 180) * R * Math.cos((lat1 + lat2) / 2);
  const dy = (node2.Latitude - node1.Latitude) * (Math.PI / 180) * R;

  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate Manhattan distance (in meters)
 * Formula: |Δlon_m| + |Δlat_m|
 * 
 * @param {Object} node1 - First node with Longitude and Latitude
 * @param {Object} node2 - Second node with Longitude and Latitude
 * @returns {number} Manhattan distance in meters
 */
export const manhattanDistance = (node1, node2) => {
  const R = 6371000; // Earth radius (m)
  const lat1 = node1.Latitude * Math.PI / 180;
  const lat2 = node2.Latitude * Math.PI / 180;

  // Convert degree difference to meters
  const dx = Math.abs((node2.Longitude - node1.Longitude) * (Math.PI / 180) * R * Math.cos((lat1 + lat2) / 2));
  const dy = Math.abs((node2.Latitude - node1.Latitude) * (Math.PI / 180) * R);

  return dx + dy;
};

/**
 * Calculate Haversine distance (real geographic distance in meters)
 * More accurate for latitude/longitude coordinates
 * 
 * @param {Object} node1 - First node with Longitude and Latitude
 * @param {Object} node2 - Second node with Longitude and Latitude
 * @returns {number} Distance in meters
 */
export const haversineDistance = (node1, node2) => {
  const R = 6371000; // Earth's radius in meters
  
  const lat1Rad = node1.Latitude * Math.PI / 180;
  const lat2Rad = node2.Latitude * Math.PI / 180;
  const deltaLat = (node2.Latitude - node1.Latitude) * Math.PI / 180;
  const deltaLon = (node2.Longitude - node1.Longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Get heuristic function by name
 * 
 * @param {string} heuristicType - Type of heuristic ('euclidean', 'manhattan', 'haversine', or 'none')
 * @returns {function} Heuristic function
 */
export const getHeuristicFunction = (heuristicType) => {
  switch (heuristicType.toLowerCase()) {
    case 'euclidean':
    case 'euculid':
      return euclideanDistance;
    case 'manhattan':
    case 'mahattan':
      return manhattanDistance;
    case 'haversine':
      return haversineDistance;
    case 'none':
    default:
      return () => 0; // No heuristic (for Dijkstra/UCS)
  }
};