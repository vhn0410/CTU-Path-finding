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
    
    open.enqueue(startNode, 0)
    let result = null

    // Helper function để deep copy
    const copyQueue = (queue) => {
        return queue.items.map(item => ({
            element: { ...item.element },
            priority: item.priority
        }));
    };

    // Trace bước khởi tạo
    traceExecution.push({
        step: 0,
        visitNode: "",
        openList: copyQueue(open),
        closeList: []
    });
    
    let step = 1;
    // console.log("Successful execute A*")

    while(!open.isEmpty()) {

        const node = open.dequeue()
        
        // ✅ THAY ĐỔI: Không bỏ qua nếu node đã visited
        // Vì có thể tìm được đường tốt hơn
        
        // Đánh dấu đã duyệt
        visited.add(node.nodeId);
        close.enqueue(node, node.fx);
        
        // Tìm thấy điểm đích
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

        // Duyệt các nút kề
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

            // ✅ THAY ĐỔI: Kiểm tra cả Open list
            const openNode = open.exists(neighborNode);
            
            if (openNode && neighborNode.fx < openNode.priority) {
                // Cập nhật node trong Open list
                open.update(openNode.element, {
                    element: neighborNode,
                    priority: neighborNode.fx
                });
                distances[neighbor.node] = newCost;
            } else if (!openNode) {
                // ✅ THAY ĐỔI: Kiểm tra cả Close list
                const closeNode = close.exists(neighborNode);
                
                if (closeNode && neighborNode.fx < closeNode.priority) {
                    // Tìm được đường tốt hơn -> Reopen node
                    // Xóa khỏi Close list
                    close.remove(closeNode.element);
                    visited.delete(neighborNode.nodeId);
                    
                    // Thêm vào Open list với cost mới
                    open.enqueue(neighborNode, neighborNode.fx);
                    distances[neighbor.node] = newCost;
                } else if (!closeNode) {
                    // Node chưa có trong cả Open và Close
                    open.enqueue(neighborNode, neighborNode.fx);
                    distances[neighbor.node] = newCost;
                }
            }
        }
        
        // Trace sau mỗi lần expand node
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
            // Tìm parent node trong close
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
        
        // Thêm start node vào path
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
    
    console.log(
        "Trace Execution:",
        JSON.stringify(
            {
            totalDistance,
            path,
            executeTime,
            traceExecution
            },
            null,
            2
        )
    );
    return {
        totalDistance: totalDistance,
        paths: path,
        executeTime: executeTime,
        traceExecution: traceExecution
    };
};