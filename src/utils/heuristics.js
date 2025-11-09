/**
 * Calculate Euclidean distance between two nodes
 * Formula: √((x2 - x1)² + (y2 - y1)²)
 * 
 * @param {Object} node1 - First node with Longitude and Latitude
 * @param {Object} node2 - Second node with Longitude and Latitude
 * @returns {number} Euclidean distance
 */
export const euclideanDistance = (node1, node2) => {
  const dx = node2.Longitude - node1.Longitude;
  const dy = node2.Latitude - node1.Latitude;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate Manhattan distance between two nodes
 * Formula: |x2 - x1| + |y2 - y1|
 * 
 * @param {Object} node1 - First node with Longitude and Latitude
 * @param {Object} node2 - Second node with Longitude and Latitude
 * @returns {number} Manhattan distance
 */
export const manhattanDistance = (node1, node2) => {
  const dx = Math.abs(node2.Longitude - node1.Longitude);
  const dy = Math.abs(node2.Latitude - node1.Latitude);
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