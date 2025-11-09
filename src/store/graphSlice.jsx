import { createSlice } from '@reduxjs/toolkit';

const defaultNodesData = [
    { Index: 0, Longitude: 105.772127, Latitude: 10.030195 },
    { Index: 1, Longitude: 105.770933, Latitude: 10.031366 },
    { Index: 2, Longitude: 105.770735, Latitude: 10.031292 },
    { Index: 3, Longitude: 105.770971, Latitude: 10.031165 },
    { Index: 4, Longitude: 105.770740, Latitude: 10.031175 },
    { Index: 5, Longitude: 105.770970, Latitude: 10.029125 },
    { Index: 6, Longitude: 105.770365, Latitude: 10.029488 },
    { Index: 7, Longitude: 105.769829, Latitude: 10.029783 },
    { Index: 8, Longitude: 105.769746, Latitude: 10.029906 },
    { Index: 9, Longitude: 105.769040, Latitude: 10.030345 },
    { Index: 10, Longitude: 105.768915, Latitude: 10.030793 },
    { Index: 11, Longitude: 105.768488, Latitude: 10.030704 },
    { Index: 12, Longitude: 105.768149, Latitude: 10.030912 },
    { Index: 13, Longitude: 105.767570, Latitude: 10.031236 },
    { Index: 14, Longitude: 105.767361, Latitude: 10.031365 },
    { Index: 15, Longitude: 105.766815, Latitude: 10.031747 },
    { Index: 16, Longitude: 105.766641, Latitude: 10.032209 },
    { Index: 17, Longitude: 105.766156, Latitude: 10.032134 },
    { Index: 18, Longitude: 105.766883, Latitude: 10.033343 },
    { Index: 19, Longitude: 105.767148, Latitude: 10.033624 },
    { Index: 20, Longitude: 105.768244, Latitude: 10.030375 },
    { Index: 21, Longitude: 105.770647, Latitude: 10.032849 },
    { Index: 22, Longitude: 105.769778, Latitude: 10.033483 },
    { Index: 23, Longitude: 105.769905, Latitude: 10.033718 },
    { Index: 24, Longitude: 105.770053, Latitude: 10.030267 },
    { Index: 25, Longitude: 105.770205, Latitude: 10.030116 },
    { Index: 26, Longitude: 105.770345, Latitude: 10.030631 },
    { Index: 27, Longitude: 105.771752, Latitude: 10.030048 },
    { Index: 28, Longitude: 105.7715277, Latitude: 10.0302336 },
    { Index: 29, Longitude: 105.770503, Latitude: 10.030866 },
    { Index: 30, Longitude: 105.771980, Latitude: 10.030338 },
    { Index: 31, Longitude: 105.764879, Latitude: 10.030774 },
    { Index: 32, Longitude: 105.7651572, Latitude: 10.0305463 },
    { Index: 33, Longitude: 105.7660462, Latitude: 10.029849 },
    { Index: 34, Longitude: 105.7663252, Latitude: 10.0320042 },
    { Index: 35, Longitude: 105.771515, Latitude: 10.0321617 },
    { Index: 36, Longitude: 105.7702302, Latitude: 10.0314433 },
    { Index: 37, Longitude: 105.7690769, Latitude: 10.0323413 },
    { Index: 38, Longitude: 105.7677502, Latitude: 10.0327048 },
    { Index: 39, Longitude: 105.7656085, Latitude: 10.0331379 },
    { Index: 40, Longitude: 105.7677707, Latitude: 10.0322413 },
    { Index: 41, Longitude: 105.7652576, Latitude: 10.0327168 },
    { Index: 42, Longitude: 105.7700807, Latitude: 10.0278477 },
    { Index: 43, Longitude: 105.7687611, Latitude: 10.0289042 },
    { Index: 44, Longitude: 105.7693082, Latitude: 10.0301614 },
    { Index: 45, Longitude: 105.7681281, Latitude: 10.0293691 },
    { Index: 46, Longitude: 105.76882, Latitude: 10.03046 },
    { Index: 47, Longitude: 105.77114, Latitude: 10.029 }
];

const defaultEdgesData = [
    { Index: 0, Node1: 0, Node2: 30, Weight: 22.63 },
    { Index: 1, Node1: 30, Node2: 27, Weight: 40.78 },
    { Index: 2, Node1: 28, Node2: 27, Weight: 32.08 },
    { Index: 3, Node1: 30, Node2: 3, Weight: 143.74 },
    { Index: 4, Node1: 3, Node2: 4, Weight: 25.32 },
    { Index: 5, Node1: 3, Node2: 1, Weight: 22.73 },
    { Index: 6, Node1: 2, Node2: 4, Weight: 13.02 },
    { Index: 7, Node1: 2, Node2: 1, Weight: 23.19 },
    { Index: 8, Node1: 4, Node2: 29, Weight: 43.06 },
    { Index: 9, Node1: 29, Node2: 26, Weight: 31.34 },
    { Index: 10, Node1: 24, Node2: 26, Weight: 51.58 },
    { Index: 11, Node1: 25, Node2: 24, Weight: 23.64 },
    { Index: 12, Node1: 8, Node2: 7, Weight: 16.42 },
    { Index: 13, Node1: 7, Node2: 6, Weight: 67.23 },
    { Index: 14, Node1: 6, Node2: 5, Weight: 77.57 },
    { Index: 15, Node1: 5, Node2: 27, Weight: 133.66 },
    { Index: 16, Node1: 9, Node2: 8, Weight: 91.43 },
    { Index: 17, Node1: 10, Node2: 9, Weight: 51.66 },
    { Index: 18, Node1: 10, Node2: 11, Weight: 47.79 },
    { Index: 19, Node1: 20, Node2: 11, Weight: 45.3 },
    { Index: 20, Node1: 11, Node2: 12, Weight: 43.73 },
    { Index: 21, Node1: 12, Node2: 13, Weight: 72.92 },
    { Index: 22, Node1: 13, Node2: 14, Weight: 27.01 },
    { Index: 23, Node1: 14, Node2: 15, Weight: 73.34 },
    { Index: 24, Node1: 15, Node2: 16, Weight: 54.79 },
    { Index: 25, Node1: 16, Node2: 17, Weight: 53.76 },
    { Index: 26, Node1: 34, Node2: 15, Weight: 60.79 },
    { Index: 27, Node1: 34, Node2: 17, Weight: 23.48 },
    { Index: 28, Node1: 19, Node2: 18, Weight: 42.64 },
    { Index: 29, Node1: 21, Node2: 22, Weight: 118.42 },
    { Index: 30, Node1: 22, Node2: 23, Weight: 29.6 },
    { Index: 31, Node1: 14, Node2: 33, Weight: 221.69 },
    { Index: 32, Node1: 32, Node2: 33, Weight: 124.43 },
    { Index: 33, Node1: 31, Node2: 32, Weight: 39.61 },
    { Index: 34, Node1: 34, Node2: 32, Weight: 206.49 },
    { Index: 35, Node1: 33, Node2: 14, Weight: 221.69 },
    { Index: 36, Node1: 18, Node2: 38, Weight: 118.51 },
    { Index: 37, Node1: 38, Node2: 40, Weight: 51.65 },
    { Index: 38, Node1: 40, Node2: 14, Weight: 107.25 },
    { Index: 39, Node1: 41, Node2: 17, Weight: 117.77 },
    { Index: 40, Node1: 41, Node2: 39, Weight: 60.5 },
    { Index: 41, Node1: 39, Node2: 18, Weight: 141.45 },
    { Index: 42, Node1: 37, Node2: 19, Weight: 254.88 },
    { Index: 43, Node1: 35, Node2: 21, Weight: 121.94 },
    { Index: 44, Node1: 1, Node2: 35, Weight: 109.07 },
    { Index: 45, Node1: 2, Node2: 36, Weight: 57.79 },
    { Index: 46, Node1: 36, Node2: 37, Weight: 160.96 },
    { Index: 47, Node1: 24, Node2: 8, Weight: 52.36 },
    { Index: 48, Node1: 22, Node2: 37, Weight: 148.38 },
    { Index: 49, Node1: 9, Node2: 46, Weight: 27.27 },
    { Index: 50, Node1: 46, Node2: 11, Weight: 45.36 },
    { Index: 51, Node1: 46, Node2: 45, Weight: 143.03 },
    { Index: 52, Node1: 45, Node2: 43, Weight: 86.47 },
    { Index: 53, Node1: 43, Node2: 44, Weight: 152.06 },
    { Index: 54, Node1: 43, Node2: 42, Weight: 186.22 },
    { Index: 55, Node1: 47, Node2: 5, Weight: 23.23 },
    { Index: 56, Node1: 47, Node2: 42, Weight: 172.78 }
];
// Helper function to build adjacency list from nodes and edges
const buildAdjacencyList = (nodes, edges) => {
  const graph = {};
  nodes.forEach(node => {
    graph[node.Index] = [];
  });
  edges.forEach(edge => {
    graph[edge.Node1].push({ node: edge.Node2, weight: edge.Weight });
    graph[edge.Node2].push({ node: edge.Node1, weight: edge.Weight });
  });
  return graph;
};

const graphSlice = createSlice({
    name: 'graph',
    initialState: {
        nodes: defaultNodesData,
        edges: defaultEdgesData,
        adjacencyList: buildAdjacencyList(defaultNodesData, defaultEdgesData), // NEW: Store graph
        startNode: '',
        endNode: '',
        algorithm: 'Built-in-Dijkstra',
        pathResult: null,
        uploadedFiles: { nodes: null, edges: null }
    },
    reducers: {
        setNodes: (state, action) => {
            state.nodes = action.payload;
            // Rebuild adjacency list when nodes change
            state.adjacencyList = buildAdjacencyList(action.payload, state.edges);
        },
        setEdges: (state, action) => {
            state.edges = action.payload;
            // Rebuild adjacency list when edges change
            state.adjacencyList = buildAdjacencyList(state.nodes, action.payload);
        },
        setStartNode: (state, action) => {
            state.startNode = action.payload;
        },
        setEndNode: (state, action) => {
            state.endNode = action.payload;
        },
        setAlgorithm: (state, action) => {
            state.algorithm = action.payload;
        },
        setPathResult: (state, action) => {
            state.pathResult = action.payload;
        },
        setUploadedFiles: (state, action) => {
            const { type, fileName } = action.payload;
            state.uploadedFiles[type] = fileName;
        },
        resetNodes: (state) => {
            state.nodes = defaultNodesData;
            state.uploadedFiles.nodes = null;
            // Rebuild adjacency list
            state.adjacencyList = buildAdjacencyList(defaultNodesData, state.edges);
        },
        resetEdges: (state) => {
            state.edges = defaultEdgesData;
            state.uploadedFiles.edges = null;
            // Rebuild adjacency list
            state.adjacencyList = buildAdjacencyList(state.nodes, defaultEdgesData);
        },
        resetAll: (state) => {
            state.nodes = defaultNodesData;
            state.edges = defaultEdgesData;
            state.adjacencyList = buildAdjacencyList(defaultNodesData, defaultEdgesData);
            state.startNode = '';
            state.endNode = '';
            state.pathResult = null;
            state.uploadedFiles = { nodes: null, edges: null };
        }
    }
});

export const {
    setNodes,
    setEdges,
    setStartNode,
    setEndNode,
    setAlgorithm,
    setPathResult,
    setUploadedFiles,
    resetNodes,
    resetEdges,
    resetAll
} = graphSlice.actions;

export default graphSlice.reducer;