// import React, { useState, useEffect, useRef } from 'react';
// import { Play, RotateCcw, Loader2 } from 'lucide-react';

// const PathfindingVisualizer = () => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);
//   const [startNode, setStartNode] = useState('');
//   const [endNode, setEndNode] = useState('');
//   const [algorithm, setAlgorithm] = useState('Moore_Dijsktra_RBT', 'DFS', 'BFS', 'moore-dijsktra');
//   const [pathResult, setPathResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [mapLoaded, setMapLoaded] = useState(false);

//   // Parse CSV data
//   useEffect(() => {
//     const nodesData = [
//       {Index: 0, Longitude: 105.772127, Latitude: 10.030195},
//       {Index: 1, Longitude: 105.770933, Latitude: 10.031366},
//       {Index: 2, Longitude: 105.770735, Latitude: 10.031292},
//       {Index: 3, Longitude: 105.770971, Latitude: 10.031165},
//       {Index: 4, Longitude: 105.770740, Latitude: 10.031175},
//       {Index: 5, Longitude: 105.770970, Latitude: 10.029125},
//       {Index: 6, Longitude: 105.770365, Latitude: 10.029488},
//       {Index: 7, Longitude: 105.769829, Latitude: 10.029783},
//       {Index: 8, Longitude: 105.769746, Latitude: 10.029906},
//       {Index: 9, Longitude: 105.769040, Latitude: 10.030345},
//       {Index: 10, Longitude: 105.768915, Latitude: 10.030793},
//       {Index: 11, Longitude: 105.768488, Latitude: 10.030704},
//       {Index: 12, Longitude: 105.768149, Latitude: 10.030912},
//       {Index: 13, Longitude: 105.767570, Latitude: 10.031236},
//       {Index: 14, Longitude: 105.767361, Latitude: 10.031365},
//       {Index: 15, Longitude: 105.766815, Latitude: 10.031747},
//       {Index: 16, Longitude: 105.766641, Latitude: 10.032209},
//       {Index: 17, Longitude: 105.766156, Latitude: 10.032134},
//       {Index: 18, Longitude: 105.766883, Latitude: 10.033343},
//       {Index: 19, Longitude: 105.767148, Latitude: 10.033624},
//       {Index: 20, Longitude: 105.768244, Latitude: 10.030375},
//       {Index: 21, Longitude: 105.770647, Latitude: 10.032849},
//       {Index: 22, Longitude: 105.769778, Latitude: 10.033483},
//       {Index: 23, Longitude: 105.769905, Latitude: 10.033718},
//       {Index: 24, Longitude: 105.770053, Latitude: 10.030267},
//       {Index: 25, Longitude: 105.770205, Latitude: 10.030116},
//       {Index: 26, Longitude: 105.770345, Latitude: 10.030631},
//       {Index: 27, Longitude: 105.771752, Latitude: 10.030048},
//       {Index: 28, Longitude: 105.7715277, Latitude: 10.0302336},
//       {Index: 29, Longitude: 105.770503, Latitude: 10.030866},
//       {Index: 30, Longitude: 105.771980, Latitude: 10.030338},
//       {Index: 31, Longitude: 105.764879, Latitude: 10.030774},
//       {Index: 32, Longitude: 105.7651572, Latitude: 10.0305463},
//       {Index: 33, Longitude: 105.7660462, Latitude: 10.029849},
//       {Index: 34, Longitude: 105.7663252, Latitude: 10.0320042},
//       {Index: 35, Longitude: 105.771515, Latitude: 10.0321617},
//       {Index: 36, Longitude: 105.7702302, Latitude: 10.0314433},
//       {Index: 37, Longitude: 105.7690769, Latitude: 10.0323413},
//       {Index: 38, Longitude: 105.7677502, Latitude: 10.0327048},
//       {Index: 39, Longitude: 105.7656085, Latitude: 10.0331379},
//       {Index: 40, Longitude: 105.7677707, Latitude: 10.0322413},
//       {Index: 41, Longitude: 105.7652576, Latitude: 10.0327168},
//       {Index: 42, Longitude: 105.7700807, Latitude: 10.0278477},
//       {Index: 43, Longitude: 105.7687611, Latitude: 10.0289042},
//       {Index: 44, Longitude: 105.7693082, Latitude: 10.0301614},
//       {Index: 45, Longitude: 105.7681281, Latitude: 10.0293691},
//       {Index: 46, Longitude: 105.76882, Latitude: 10.03046},
//       {Index: 47, Longitude: 105.77114, Latitude: 10.029}
//     ];

//     const edgesData = [
//       {Index: 0, Node1: 0, Node2: 30, Weight: 22.63},
//       {Index: 1, Node1: 30, Node2: 27, Weight: 40.78},
//       {Index: 2, Node1: 28, Node2: 27, Weight: 32.08},
//       {Index: 3, Node1: 30, Node2: 3, Weight: 143.74},
//       {Index: 4, Node1: 3, Node2: 4, Weight: 25.32},
//       {Index: 5, Node1: 3, Node2: 1, Weight: 22.73},
//       {Index: 6, Node1: 2, Node2: 4, Weight: 13.02},
//       {Index: 7, Node1: 2, Node2: 1, Weight: 23.19},
//       {Index: 8, Node1: 4, Node2: 29, Weight: 43.06},
//       {Index: 9, Node1: 29, Node2: 26, Weight: 31.34},
//       {Index: 10, Node1: 24, Node2: 26, Weight: 51.58},
//       {Index: 11, Node1: 25, Node2: 24, Weight: 23.64},
//       {Index: 12, Node1: 8, Node2: 7, Weight: 16.42},
//       {Index: 13, Node1: 7, Node2: 6, Weight: 67.23},
//       {Index: 14, Node1: 6, Node2: 5, Weight: 77.57},
//       {Index: 15, Node1: 5, Node2: 27, Weight: 133.66},
//       {Index: 16, Node1: 9, Node2: 8, Weight: 91.43},
//       {Index: 17, Node1: 10, Node2: 9, Weight: 51.66},
//       {Index: 18, Node1: 10, Node2: 11, Weight: 47.79},
//       {Index: 19, Node1: 20, Node2: 11, Weight: 45.3},
//       {Index: 20, Node1: 11, Node2: 12, Weight: 43.73},
//       {Index: 21, Node1: 12, Node2: 13, Weight: 72.92},
//       {Index: 22, Node1: 13, Node2: 14, Weight: 27.01},
//       {Index: 23, Node1: 14, Node2: 15, Weight: 73.34},
//       {Index: 24, Node1: 15, Node2: 16, Weight: 54.79},
//       {Index: 25, Node1: 16, Node2: 17, Weight: 53.76},
//       {Index: 26, Node1: 34, Node2: 15, Weight: 60.79},
//       {Index: 27, Node1: 34, Node2: 17, Weight: 23.48},
//       {Index: 28, Node1: 19, Node2: 18, Weight: 42.64},
//       {Index: 29, Node1: 21, Node2: 22, Weight: 118.42},
//       {Index: 30, Node1: 22, Node2: 23, Weight: 29.6},
//       {Index: 31, Node1: 14, Node2: 33, Weight: 221.69},
//       {Index: 32, Node1: 32, Node2: 33, Weight: 124.43},
//       {Index: 33, Node1: 31, Node2: 32, Weight: 39.61},
//       {Index: 34, Node1: 34, Node2: 32, Weight: 206.49},
//       {Index: 35, Node1: 33, Node2: 14, Weight: 221.69},
//       {Index: 36, Node1: 18, Node2: 38, Weight: 118.51},
//       {Index: 37, Node1: 38, Node2: 40, Weight: 51.65},
//       {Index: 38, Node1: 40, Node2: 14, Weight: 107.25},
//       {Index: 39, Node1: 41, Node2: 17, Weight: 117.77},
//       {Index: 40, Node1: 41, Node2: 39, Weight: 60.5},
//       {Index: 41, Node1: 39, Node2: 18, Weight: 141.45},
//       {Index: 42, Node1: 37, Node2: 19, Weight: 254.88},
//       {Index: 43, Node1: 35, Node2: 21, Weight: 121.94},
//       {Index: 44, Node1: 1, Node2: 35, Weight: 109.07},
//       {Index: 45, Node1: 2, Node2: 36, Weight: 57.79},
//       {Index: 46, Node1: 36, Node2: 37, Weight: 160.96},
//       {Index: 47, Node1: 24, Node2: 8, Weight: 52.36},
//       {Index: 48, Node1: 22, Node2: 37, Weight: 148.38},
//       {Index: 49, Node1: 9, Node2: 46, Weight: 27.27},
//       {Index: 50, Node1: 46, Node2: 11, Weight: 45.36},
//       {Index: 51, Node1: 46, Node2: 45, Weight: 143.03},
//       {Index: 52, Node1: 45, Node2: 43, Weight: 86.47},
//       {Index: 53, Node1: 43, Node2: 44, Weight: 152.06},
//       {Index: 54, Node1: 43, Node2: 42, Weight: 186.22},
//       {Index: 55, Node1: 47, Node2: 5, Weight: 23.23},
//       {Index: 56, Node1: 47, Node2: 42, Weight: 172.78}
//     ];

//     setNodes(nodesData);
//     setEdges(edgesData);
//   }, []);

//   // Initialize OpenLayers map
//   useEffect(() => {
//     if (!mapRef.current || nodes.length === 0) return;

//     const script1 = document.createElement('script');
//     script1.src = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js';
//     script1.async = true;

//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css';

//     document.head.appendChild(link);
//     document.body.appendChild(script1);

//     script1.onload = () => {
//       setMapLoaded(true);
//     };

//     return () => {
//       if (script1.parentNode) script1.parentNode.removeChild(script1);
//       if (link.parentNode) link.parentNode.removeChild(link);
//     };
//   }, [nodes]);

//   // Create map after OpenLayers loads
//   useEffect(() => {
//     if (!mapLoaded || !window.ol || mapInstanceRef.current) return;

//     const ol = window.ol;

//     // Create vector source and layer for nodes and edges
//     const vectorSource = new ol.source.Vector();
//     const vectorLayer = new ol.layer.Vector({
//       source: vectorSource,
//       style: new ol.style.Style({
//         stroke: new ol.style.Stroke({
//           color: '#94a3b8',
//           width: 2
//         }),
//         fill: new ol.style.Fill({
//           color: 'rgba(148, 163, 184, 0.3)'
//         })
//       })
//     });

//     // Create map
//     const map = new ol.Map({
//       target: mapRef.current,
//       layers: [
//         new ol.layer.Tile({
//           source: new ol.source.OSM()
//         }),
//         vectorLayer
//       ],
//       view: new ol.View({
//         center: ol.proj.fromLonLat([105.769, 10.031]),
//         zoom: 16
//       })
//     });

//     mapInstanceRef.current = { map, vectorSource, ol };

//     return () => {
//       map.setTarget(null);
//       mapInstanceRef.current = null;
//     };
//   }, [mapLoaded]);

//   // Draw graph on map
//   useEffect(() => {
//     if (!mapInstanceRef.current || nodes.length === 0 || edges.length === 0) return;

//     const { vectorSource, ol } = mapInstanceRef.current;
//     vectorSource.clear();

//     // Draw edges
//     edges.forEach(edge => {
//       const node1 = nodes.find(n => n.Index === edge.Node1);
//       const node2 = nodes.find(n => n.Index === edge.Node2);
      
//       if (node1 && node2) {
//         const line = new ol.geom.LineString([
//           [node1.Longitude, node1.Latitude],
//           [node2.Longitude, node2.Latitude]
//         ]);
//         line.transform('EPSG:4326', 'EPSG:3857');

//         const feature = new ol.Feature({
//           geometry: line,
//           type: 'edge'
//         });

//         feature.setStyle(new ol.style.Style({
//           stroke: new ol.style.Stroke({
//             color: '#793131ff',
//             width: 2
//           })
//         }));  

//         vectorSource.addFeature(feature);
//       }
//     });

//     // Draw path if exists
//     if (pathResult && pathResult.paths.length > 1) {
//       for (let i = 0; i < pathResult.paths.length - 1; i++) {
//         const current = pathResult.paths[i];
//         const next = pathResult.paths[i + 1];

//         const line = new ol.geom.LineString([
//           [current.geometryX, current.geometryY],
//           [next.geometryX, next.geometryY]
//         ]);
//         line.transform('EPSG:4326', 'EPSG:3857');

//         const feature = new ol.Feature({
//           geometry: line,
//           type: 'path'
//         });

//         feature.setStyle(new ol.style.Style({
//           stroke: new ol.style.Stroke({
//             color: '#3b82f6',
//             width: 4
//           })
//         }));

//         vectorSource.addFeature(feature);
//       }
//     }

//     // Draw nodes
//     const pathNodeIds = pathResult ? pathResult.paths.map(p => p.id) : [];

//     nodes.forEach(node => {
//       const point = new ol.geom.Point([node.Longitude, node.Latitude]);
//       point.transform('EPSG:4326', 'EPSG:3857');

//       const nodeId = node.Index.toString();
//       const isInPath = pathNodeIds.includes(nodeId);
//       const isStart = nodeId === startNode;
//       const isEnd = nodeId === endNode;

//       let fillColor, strokeColor, radius;
      
//       if (isStart) {
//         fillColor = '#10b981';
//         strokeColor = '#ffffff';
//         radius = 8;
//       } else if (isEnd) {
//         fillColor = '#ef4444';
//         strokeColor = '#ffffff';
//         radius = 8;
//       } else if (isInPath) {
//         fillColor = '#3b82f6';
//         strokeColor = '#ffffff';
//         radius = 7;
//       } else {
//         fillColor = '#6b7280';
//         strokeColor = '#ffffff';
//         radius = 6;
//       }

//       const feature = new ol.Feature({
//         geometry: point,
//         type: 'node',
//         nodeId: nodeId
//       });

//       feature.setStyle(new ol.style.Style({
//         image: new ol.style.Circle({
//           radius: radius,
//           fill: new ol.style.Fill({ color: fillColor }),
//           stroke: new ol.style.Stroke({
//             color: strokeColor,
//             width: 2
//           })
//         }),
//         text: new ol.style.Text({
//           text: nodeId,
//           offsetY: -15,
//           font: 'bold 12px sans-serif',
//           fill: new ol.style.Fill({ color: '#372323ff' }),
//           stroke: new ol.style.Stroke({
//             color: '#ffffff',
//             width: 3
//           })
//         })
//       }));

//       vectorSource.addFeature(feature);
//     });

//   }, [nodes, edges, pathResult, startNode, endNode, mapLoaded]);

//   const findPath = async () => {
//     if (!startNode || !endNode) {
//       setError('Please select both start and end nodes');
//       return;
//     }

//     if (startNode === endNode) {
//       setError('Start and end nodes must be different');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setPathResult(null);

//     try {
//       const response = await fetch(`http://localhost:8081/api/Graph/${algorithm}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           startNode: startNode,
//           endNode: endNode
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`API error: ${response.status}`);
//       }

//       const data = await response.json();
//       setPathResult(data);
//     } catch (err) {
//       setError(`Error: ${err.message}. Make sure the API server is running on localhost:8081`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const reset = () => {
//   //   setStartNode('');
//   //   setEndNode('');
//   //   setPathResult(null);
//   //   setError('');
//   // };

//   const nodeOptions = nodes.map(n => n.Index.toString()).sort((a, b) => parseInt(a) - parseInt(b));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <h1 className="text-3xl font-bold text-slate-800 mb-2">CTU Pathfinding</h1>
//           <p className="text-slate-600">Find the shortest path between nodes using various algorithms visualized on real map coordinates</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Controls Panel */}
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-semibold text-slate-800 mb-4">Pathfinding Controls</h2>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Algorithm
//                   </label>
//                   <select
//                     value={algorithm}
//                     onChange={(e) => setAlgorithm(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="Moore_Dijsktra_RBT">Moore-Dijkstra RBT</option>
//                     <option value="DFS">DFS</option>
//                     <option value="BFS">BFS</option>
//                     <option value="moore-dijsktra">Moore-Dijkstra</option>
//                     {/* <option value="Astar">A* Algorithm</option>
//                     <option value="Dijkstra">Dijkstra</option>
//                     <option value="BellmanFord">Bellman-Ford</option> */}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Start Node
//                   </label>
//                   <select
//                     value={startNode}
//                     onChange={(e) => setStartNode(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                   >
//                     <option value="">Select start node</option>
//                     {nodeOptions.map(idx => (
//                       <option key={idx} value={idx}>Node {idx}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     End Node
//                   </label>
//                   <select
//                     value={endNode}
//                     onChange={(e) => setEndNode(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                   >
//                     <option value="">Select end node</option>
//                     {nodeOptions.map(idx => (
//                       <option key={idx} value={idx}>Node {idx}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={findPath}
//                     disabled={loading || !startNode || !endNode}
//                     className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Finding...
//                       </>
//                     ) : (
//                       <>
//                         <Play className="w-4 h-4 text-slate-700 font-medium" />
//                         <p className=" text-slate-700 font-medium">Find Path</p>
//                       </>
//                     )}
//                   </button>
//                   {/* <button
//                     onClick={reset}
//                     className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
//                   >
//                     <RotateCcw className="w-4 h-4" />
//                   </button> */}
//                 </div>

//                 {error && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                     {error}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Results Panel */}
//             {pathResult && (
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <h2 className="text-xl font-semibold text-slate-800 mb-4">Path Results</h2>
//                 <div className="space-y-3">
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                     <p className="text-sm text-slate-600">Total Distance</p>
//                     <p className="text-2xl font-bold text-blue-600">{pathResult.totalDistance.toFixed(2)}m</p>
//                   </div>
//                   <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
//                     <p className="text-sm text-slate-600">Execution Time</p>
//                     <p className="text-lg font-semibold text-slate-700">{pathResult.executeTime}</p>
//                   </div>
//                   <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
//                     <p className="text-sm text-slate-600 mb-2">Path Sequence</p>
//                     <div className="flex flex-wrap gap-1">
//                       {pathResult.paths.slice().reverse().map((p, idx) => (
//                         <span
//                           key={idx}
//                           className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
//                         >
//                           {p.id}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Legend */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-semibold text-slate-800 mb-4">Legend</h2>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                   <span className="text-sm text-slate-700">Start Node</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
//                   <span className="text-sm text-slate-700">End Node</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
//                   <span className="text-sm text-slate-700">Path Node</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 bg-slate-500 rounded-full border-2 border-white"></div>
//                   <span className="text-sm text-slate-700">Regular Node</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-0.5 bg-blue-500"></div>
//                   <span className="text-sm text-slate-700">Shortest Path</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Map Visualization */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h2 className="text-xl font-semibold text-slate-800 mb-4">Map Visualization</h2>
//               <div
//                 ref={mapRef}
//                 className="w-full h-[700px] border border-slate-200 rounded-lg overflow-hidden"
//                 style={{ position: 'relative' }}
//               />
//               {!mapLoaded && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
//                   <div className="text-center">
//                     <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
//                     <p className="text-slate-600">Loading map...</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PathfindingVisualizer;