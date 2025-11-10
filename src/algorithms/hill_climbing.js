import { getHeuristicFunction } from "../utils/heuristics";
import { reconstructPath } from "../utils/reconstruct_path";

export function HillClimbing(graph, nodes, edges, startNodeId, endNodeId, heuristicType) {
    const heuristicFunction = getHeuristicFunction(heuristicType);
    const startTime = performance.now();
    
    // Algorithm initialization
    const visited = new Set();
    const distances = {};
    const traceExecution = [];
    const parentMap = {};
    parentMap[startNodeId] = null;

    distances[parseInt(startNodeId)] = 0;
    
    let currentNode = {
        nodeId: parseInt(startNodeId),
        parent: -1,
        cost: 0,
        heuristic: heuristicFunction(nodes[startNodeId], nodes[endNodeId])
    };
    
    let result = null;
    let step = 0;
    
    // Initial trace
    traceExecution.push({
        step: step,
        currentNode: currentNode.nodeId,
        heuristic: currentNode.heuristic,
        visited: Array.from(visited),
        neighbors: []
    });
    
    step++;
    
    // Hill Climbing loop
    while (currentNode !== null) {
        // Mark current node as visited
        visited.add(currentNode.nodeId);
        
        // Check if goal is reached
        if (currentNode.nodeId === parseInt(endNodeId)) {
            result = currentNode;
            traceExecution.push({
                step: step,
                currentNode: currentNode.nodeId,
                heuristic: currentNode.heuristic,
                visited: Array.from(visited),
                isGoal: true
            });
            break;
        }
        
        // Get all neighbors
        const neighbors = graph[currentNode.nodeId] || [];
        
        // Find the best neighbor (lowest heuristic value)
        let bestNeighbor = null;
        let bestHeuristic = Infinity;
        const neighborInfo = [];
        
        for (const neighbor of neighbors) {
            // Skip visited nodes
            if (visited.has(neighbor.node)) {
                continue;
            }
            
            const heuristic = heuristicFunction(nodes[neighbor.node], nodes[endNodeId]);
            const newCost = currentNode.cost + neighbor.weight;
            
            neighborInfo.push({
                nodeId: neighbor.node,
                heuristic: heuristic,
                cost: newCost,
                weight: neighbor.weight
            });
            
            // Select neighbor with lowest heuristic (greedy choice)
            if (heuristic < bestHeuristic) {
                bestHeuristic = heuristic;
                bestNeighbor = {
                    nodeId: neighbor.node,
                    parent: currentNode.nodeId,
                    cost: newCost,
                    heuristic: heuristic
                };
                parentMap[bestNeighbor.nodeId] = currentNode.nodeId;

            }
        }
        
        // Trace current step
        traceExecution.push({
            step: step,
            currentNode: currentNode.nodeId,
            heuristic: currentNode.heuristic,
            visited: Array.from(visited),
            neighbors: neighborInfo,
            selectedNeighbor: bestNeighbor ? bestNeighbor.nodeId : null
        });
        
        // If no better neighbor found (local maximum or all neighbors visited)
        if (bestNeighbor === null) {
            traceExecution.push({
                step: step + 1,
                currentNode: currentNode.nodeId,
                heuristic: currentNode.heuristic,
                visited: Array.from(visited),
                stuck: true,
                message: "No better neighbor found - stuck at local maximum"
            });
            break;
        }
        
        // Move to best neighbor
        distances[bestNeighbor.nodeId] = bestNeighbor.cost;
        currentNode = bestNeighbor;
        step++;
    }
    
    // Reconstruct path with proper format
    let path = [];
    let totalDistance = 0;

    if (result) {
        totalDistance = result.cost;

        let current = result.nodeId;

        while (current !== null) {
            path.unshift(current);
            current = parentMap[current];
        }

        // Convert to required format
        path = path.map((nodeId, index) => {
            const nodeData = nodes[nodeId];
            return {
                id: nodeId,
                ordinal: index,
                geometryX: nodeData.Longitude,
                geometryY: nodeData.Latitude,
                distanceFromStartNode: distances[nodeId] || 0,
                direction: "undefined"
            };
        });
    } else {
        console.log("No path found - algorithm got stuck");
    }
    
    const endTime = performance.now();
    const executeTime = `${(endTime - startTime).toFixed(2)} ms`;
    // console.log(traceExecution)
    return {
        totalDistance: totalDistance,
        paths: path,
        executeTime: executeTime,
        traceExecution: traceExecution,
        success: result !== null
    };
}