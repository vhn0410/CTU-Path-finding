// import { PriorityQueue } from "../data-stuctures/PriorityQueue";
import { PriorityQueue } from "../data-stuctures/MiniHeap";
import { getHeuristicFunction } from "../utils/heuristics";
import { reconstructPath } from "../utils/reconstruct_path";


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
        for (const neighbor of graph[node.nodeId] || []) {

            const newCost = node.cost + neighbor.weight;
            const hx = heuristicFunction(nodes[neighbor.node], nodes[endNodeId]);
            const fx = newCost + hx;


            const neighborNode = {
                nodeId: neighbor.node,
                parent: node.nodeId,
                cost: newCost,
                heuristicx: hx,
                fx: fx
            }

            const openNode = open.exists(neighborNode);
            const closeNode = close.exists(neighborNode);

            // Check open list
            // update node if there's a shorter path
            // const openNode = open.exists(neighborNode);
            if (closeNode && fx < closeNode.fx) {
                // Reopen node
                close.remove(closeNode.element);
                // add to Open list with new cost
                open.enqueue(neighborNode, neighborNode.fx);
                distances[neighbor.node] = newCost;
            } 
            else if (openNode && fx < openNode.priority) {
                open.update(openNode.element, {
                    element: neighborNode,
                    priority: neighborNode.fx
                });
                distances[neighbor.node] = newCost;
            } 
            else if (!openNode && !closeNode) {
                open.enqueue(neighborNode, neighborNode.fx);
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