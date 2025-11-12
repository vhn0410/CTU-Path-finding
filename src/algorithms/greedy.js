import { PriorityQueue } from "../data-stuctures/PriorityQueue";
import { getHeuristicFunction } from "../utils/heuristics";
import { reconstructPath } from "../utils/reconstruct_path";

// Built-in Greedy Algorithm

export function Greedy(graph, nodes, edges, startNodeId, endNodeId, heuristicType) {
    const heuristicFunction = getHeuristicFunction(heuristicType)
    const startTime = performance.now();
    
    // algorithm
    const open = new PriorityQueue()
    const close = new PriorityQueue()

    const visited = new Set()
    const distances = {};
    const traceExecution = [];  

    distances[parseInt(startNodeId)] = 0;

    console.log("Greedy")
    
    const startNode = {
        nodeId: parseInt(startNodeId),
        parent: -1,
        cost: 0,
        heuristicx: heuristicFunction(nodes[startNodeId], nodes[endNodeId])
    };
    
    open.enqueue(startNode, 0)
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
        
        // continue if node is visited
        if(visited.has(node.nodeId)) continue;

        // mark as visited
        visited.add(node.nodeId);
        close.enqueue(node, node.heuristicx);
        
        // Goal
        if (node.nodeId === parseInt(endNodeId)) 
        {
            result = node;
            // record tracing in last step
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
                heuristicx: heuristicFunction(nodes[neighbor.node], nodes[endNodeId])
            }

            if (!visited.has(neighborNode.nodeId)) {
                const openNode = open.exists(neighborNode);
                
                // update node if there's a shorter path
                if (openNode && neighborNode.heuristicx < openNode.priority) {
                    open.update(openNode.element, {
                        element: neighborNode,
                        priority: neighborNode.heuristicx
                    });
                } else if (!openNode) {
                    open.enqueue(neighborNode, neighborNode.heuristicx);
                }
                distances[neighbor.node] = newCost;
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
    let path = [];
    let totalDistance = 0;
    
    if (result) {
        console.log("Find path ", result);
        totalDistance = result.cost;
        path = reconstructPath(result, nodes, startNodeId, distances, close)
    } else {
        console.log("There is no path");
    } 

    const endTime = performance.now();
    const executeTime = `${(endTime - startTime).toFixed(2)} ms`;
    
    console.log(
        "Trace Execution:",
        JSON.stringify(
            {
            totalDistance,
            path,
            executeTime,
            traceExecution
            },
            null, // replacer
            2     // indentation for pretty print
        )
    );
    // console.log(traceExecution)
    return {
        totalDistance: totalDistance,
        paths: path,
        executeTime: executeTime,
        traceExecution: traceExecution
    };
};