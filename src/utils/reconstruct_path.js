export function reconstructPath(result = {
        nodeId,
        parent,
        cost,
        heuristicx,
        fx,
    }, nodes, startNodeId, distances, close) {
    // Reconstruct path
    const path = [];
    
    let current = result;
        
    // Trace back path
    while (current.nodeId !== parseInt(startNodeId)) {
        const node = nodes[current.nodeId];
        if (node) {
            path.unshift({
                id: current.nodeId.toString(),
                ordinal: 0,
                geometryX: node.Longitude,
                geometryY: node.Latitude,
                distanceFromStartNode: distances[current.nodeId],
                direction: "undefined"
            });
        }
        // finding parent node in close
        let found = false;
        for (let i = 0; i < close.items.length; i++) {
            if (close.items[i].element.nodeId === current.parent) {
                current = close.items[i].element;
                found = true;
                break;
            }
        }
        if (!found) break;
    }
    
    // add start node to path
    const startNodeData = nodes[startNodeId];
    if (startNodeData) {
        path.unshift({
            id: startNodeId.toString(),
            ordinal: 0,
            geometryX: startNodeData.Longitude,
            geometryY: startNodeData.Latitude,
            distanceFromStartNode: 0,
            direction: "undefined"
        });
    }
   

    return path;
}