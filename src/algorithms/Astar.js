import { PriorityQueue } from "../data-stuctures/PriorityQueue";
import { getHeuristicFunction } from "../utils/heuristics";


export function Astar(graph, nodes, edges, startNodeId, endNodeId, heuristicType) {
    const heuristicFunction = getHeuristicFunction(heuristicType)
    const startTime = performance.now();
    
    // algorithm
    const open = new PriorityQueue()
    const close = new PriorityQueue()

    const visited = new Set()
    const distances = {};
    const traceExecution = [];

    distances[parseInt(startNodeId)] = 0;
    
    const startNode = {
        nodeId: parseInt(startNodeId),
        parent: -1,
        cost: 0,
        heuristicx: heuristicFunction(nodes[startNodeId], nodes[endNodeId]),
        fx: heuristicFunction(nodes[startNodeId], nodes[endNodeId])
    };
    
    open.enqueue(startNode, startNode.fx)
    let result = null

    // Helper function để deep copy
    const copyQueue = (queue) => {
        return queue.items.map(item => ({
            element: { ...item.element },
            priority: item.priority
        }));
    };

    // Init trace 
    traceExecution.push({
        step: 0,
        visitNode: "",
        openList: copyQueue(open),
        closeList: []
    });
    
    let step = 1;

    while(!open.isEmpty()) {

        const node = open.dequeue()
        
        // mark as visited
        visited.add(node.nodeId);
        close.enqueue(node, node.fx);
        
        // Check Goal
        if (node.nodeId === parseInt(endNodeId)) 
        {
            result = node;
            traceExecution.push({
                step: step,
                visitNode: node.nodeId,
                openList: copyQueue(open),
                closeList: copyQueue(close),
                isGoal: true
            });
            break;
        }

        // traversal all neighbors of visit node
        const neighbors = graph[node.nodeId] || [];
        for (let i = 0; i < neighbors.length; i++) {

            const neighbor = neighbors[i];
            const newCost = node.cost + neighbor.weight;

            const neighborNode = {
                nodeId: neighbor.node,
                parent: node.nodeId,
                cost: newCost,
                heuristicx: heuristicFunction(nodes[neighbor.node], nodes[endNodeId]),
                fx: newCost + heuristicFunction(nodes[neighbor.node], nodes[endNodeId])
            }

            // Check open list
            // update node if there's a shorter path
            const openNode = open.exists(neighborNode);

            if (openNode && neighborNode.fx < openNode.priority) {
                open.update(openNode.element, {
                    element: neighborNode,
                    priority: neighborNode.fx
                });
                distances[neighbor.node] = newCost;
            } else if (!openNode) {
                // Check close list
                const closeNode = close.exists(neighborNode);
                
                if (closeNode && neighborNode.fx < closeNode.priority) {
                    // Found shorter path then Reopen node
                    console.log("Tìm được đường tốt hơn -> Reopen node")
                    // remove node from Close list
                    close.remove(closeNode.element);
                    visited.delete(neighborNode.nodeId);
                    
                    // add to Open list with new cost
                    open.enqueue(neighborNode, neighborNode.fx);
                    distances[neighbor.node] = newCost;
                } else if (!closeNode) {
                    // Add to Openlist if it not in Open & Close list
                    open.enqueue(neighborNode, neighborNode.fx);
                    distances[neighbor.node] = newCost;
                }
            }
        }
        
        // trace after expand the node
        traceExecution.push({
            step: step,
            visitNode: node.nodeId,
            openList: copyQueue(open),
            closeList: copyQueue(close)
        });
        
        step += 1;
    }
    
    // Reconstruct path
    const path = [];
    let totalDistance = 0;
    
    if (result) {
        console.log("Find path ", result);
        let current = result;
        totalDistance = result.cost;
        
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
    } else {
        console.log("There is no path");
    } 

    const endTime = performance.now();
    const executeTime = `${(endTime - startTime).toFixed(2)} ms`;
    
    // console.log(
    //     "Trace Execution:",
    //     JSON.stringify(
    //         {
    //         totalDistance,
    //         path,
    //         executeTime,
    //         traceExecution
    //         },
    //         null,
    //         2
    //     )
    // );
    return {
        totalDistance: totalDistance,
        paths: path,
        executeTime: executeTime,
        traceExecution: traceExecution
    };
};