// Built-in Dijkstra Algorithm

export function dijkstraAlgorithm(nodes, edges, startNodeId, endNodeId) {
    console.log(nodes, edges, startNodeId, endNodeId)
    const startTime = performance.now();

    // Build adjacency list
    const graph = {};
    nodes.forEach(node => {
        graph[node.Index] = [];
    });

    edges.forEach(edge => {
        graph[edge.Node1].push({ node: edge.Node2, weight: edge.Weight });
        graph[edge.Node2].push({ node: edge.Node1, weight: edge.Weight });
    });

    // Initialize distances and previous nodes
    const distances = {};
    const previous = {};
    const unvisited = new Set();

    nodes.forEach(node => {
        distances[node.Index] = Infinity;
        previous[node.Index] = null;
        unvisited.add(node.Index);
    });

    distances[parseInt(startNodeId)] = 0;

    while (unvisited.size > 0) {
        // Find node with minimum distance
        let currentNode = null;
        let minDistance = Infinity;

        unvisited.forEach(nodeId => {
            if (distances[nodeId] < minDistance) {
                minDistance = distances[nodeId];
                currentNode = nodeId;
            }
        });

        if (currentNode === null || distances[currentNode] === Infinity) break;

        unvisited.delete(currentNode);

        // Found the destination
        if (currentNode === parseInt(endNodeId)) break;

        // Update distances for neighbors
        if (graph[currentNode]) {
            graph[currentNode].forEach(({ node, weight }) => {
                if (unvisited.has(node)) {
                    const newDistance = distances[currentNode] + weight;
                    if (newDistance < distances[node]) {
                        distances[node] = newDistance;
                        previous[node] = currentNode;
                    }
                }
            });
        }
    }

    // Reconstruct path
    const path = [];
    let current = parseInt(endNodeId);

    while (current !== null) {
        const node = nodes.find(n => n.Index === current);
        if (node) {
            path.unshift({
                id: current.toString(),
                ordinal: 0,
                geometryX: node.Longitude,
                geometryY: node.Latitude,
                distanceFromStartNode: distances[current],
                direction: "undefined"
            });
        }
        current = previous[current];
    }

    const endTime = performance.now();
    const executeTime = `${(endTime - startTime).toFixed(2)} ms`;
    console.log(path)
    return {
        totalDistance: distances[parseInt(endNodeId)],
        paths: path,
        executeTime: executeTime
    };
};