import { PriorityQueue } from "../data-stuctures/PriorityQueue";

// Built-in UCS Algorithm

export function UCS(nodes, edges, startNodeId, endNodeId) {
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
    
    // algorithm
    const open = new PriorityQueue()
    const close = new PriorityQueue()

    const visited = new Set()
    const distances = {};
    const traceExecution = [];  // ✅ Đổi thành array thay vì object

    distances[parseInt(startNodeId)] = 0;

    console.log("UCS")
    
    const startNode = {
        nodeId: parseInt(startNodeId),
        parent: -1,
        cost: 0
    };
    
    open.enqueue(startNode, 0)
    let result = null

    // ✅ Helper function để deep copy
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
    
    while(!open.isEmpty()) {

        const node = open.dequeue()
        console.log("Visited: ", node)  
        
        // Bỏ qua nếu node đã được duyệt
        if(visited.has(node.nodeId)) continue;

        // Đánh dấu đã duyệt
        visited.add(node.nodeId);
        close.enqueue(node, node.cost);
        
        // Tìm thấy điểm đích
        if (node.nodeId === parseInt(endNodeId)) 
        {
            result = node;
            // ✅ Trace bước cuối cùng
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
                cost: newCost
            }

            // Chỉ thêm nếu nút chưa duyệt
            if (!visited.has(neighborNode.nodeId)) {
                const openNode = open.exists(neighborNode);
                
                // So sánh < để tìm path ngắn hơn
                if (openNode && newCost < openNode.priority) {
                    open.update(openNode.element, {
                        element: neighborNode,
                        priority: newCost
                    });
                } else if (!openNode) {
                    open.enqueue(neighborNode, newCost);
                }
                distances[neighbor.node] = newCost;
            }
        }
        
        // ✅ Trace sau mỗi lần expand node
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
            const node = nodes.find(n => n.Index === current.nodeId);
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
        
        // ✅ Thêm start node vào path
        const startNodeData = nodes.find(n => n.Index === parseInt(startNodeId));
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
            null, // replacer
            2     // indentation for pretty print
        )
    );

    return {
        totalDistance: totalDistance,
        paths: path,
        executeTime: executeTime,
        traceExecution: traceExecution
    };
};