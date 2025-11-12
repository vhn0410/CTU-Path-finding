import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Loader2, Upload, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setNodes,
  setEdges,
  setStartNode,
  setEndNode,
  setAlgorithm,
  setPathResult,
  setUploadedFiles,
  resetNodes,
  resetEdges,
  resetAll,
  resetPathResult
} from './store/graphSlice';

import { UCS } from './algorithms/ucs';
import { MyTable } from './components/MyTable';
import { Greedy } from './algorithms/greedy';
import { Astar } from './algorithms/Astar';
import { HillClimbing } from './algorithms/hill_climbing';

const PathfindingVisualizer4 = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const nodes = useSelector(state => state.graph.nodes);
  const edges = useSelector(state => state.graph.edges);
  const startNode = useSelector(state => state.graph.startNode);
  const endNode = useSelector(state => state.graph.endNode);
  const algorithm = useSelector(state => state.graph.algorithm);
  const pathResult = useSelector(state => state.graph.pathResult);
  const uploadedFiles = useSelector(state => state.graph.uploadedFiles);
  const graph = useSelector(state => state.graph.adjacencyList);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const nodeFileRef = useRef(null);
  const edgeFileRef = useRef(null);

  const [heuristic, setHeuristic] = useState('euclidean');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Trace execution states
  const [currentTraceStep, setCurrentTraceStep] = useState(0);
  const [isTracingMode, setIsTracingMode] = useState(false);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((header, index) => {
        const value = values[index];
        obj[header] = isNaN(value) ? value : parseFloat(value);
      });
      return obj;
    });
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = parseCSV(text);
      const headers = Object.keys(data[0] || {});

      if (type === 'nodes') {
        const requiredCols = ['Index', 'Longitude', 'Latitude'];
        const missingCols = requiredCols.filter(col => !headers.includes(col));
        if (missingCols.length > 0) {
          throw new Error(`File nodes thiếu các cột: ${missingCols.join(', ')}`);
        }
        dispatch(setNodes(data));
        dispatch(setUploadedFiles({ ...uploadedFiles, nodes: file.name }));
      } else if (type === 'edges') {
        const requiredCols = ['Index', 'Node1', 'Node2', 'Weight'];
        const missingCols = requiredCols.filter(col => !headers.includes(col));
        if (missingCols.length > 0) {
          throw new Error(`File edges thiếu các cột: ${missingCols.join(', ')}`);
        }
        dispatch(setEdges(data));
        dispatch(setUploadedFiles({ ...uploadedFiles, edges: file.name }));
      }
      setError('');
    } catch (err) {
      setError(`Lỗi khi đọc file: ${err.message}`);
    }
  };

  const clearFile = (type) => {
    if (type === 'nodes') {
      dispatch(resetNodes());
      if (nodeFileRef.current) nodeFileRef.current.value = '';
    } else {
      dispatch(resetEdges());
      if (edgeFileRef.current) edgeFileRef.current.value = '';
    }
    dispatch(setPathResult(null));
  };

  useEffect(() => {
    if (!mapRef.current || nodes.length === 0) return;

    const script1 = document.createElement('script');
    script1.src = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js';
    script1.async = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css';

    document.head.appendChild(link);
    document.body.appendChild(script1);

    script1.onload = () => {
      setMapLoaded(true);
    };

    return () => {
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [nodes]);
  // console.log(pathResult.traceExecution[pathResult.traceExecution.length - 1])
  useEffect(() => {
    if (!mapLoaded || !window.ol || mapInstanceRef.current) return;

    const ol = window.ol;
    const vectorSource = new ol.source.Vector();
    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#94a3b8',
          width: 2
        }),
        fill: new ol.style.Fill({
          color: 'rgba(148, 163, 184, 0.3)'
        })
      })
    });

    const map = new ol.Map({
      target: mapRef.current,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([105.769, 10.031]),
        zoom: 16
      })
    });

    mapInstanceRef.current = { map, vectorSource, ol };

    return () => {
      map.setTarget(null);
      mapInstanceRef.current = null;
    };
  }, [mapLoaded]);

  // Draw graph on map with trace visualization
  useEffect(() => {
    if (!mapInstanceRef.current || nodes.length === 0 || edges.length === 0) return;

    const { vectorSource, ol } = mapInstanceRef.current;
    vectorSource.clear();

    // Draw edges
    // console.log(edges)
    edges.forEach(edge => {
      // const node1 = nodes.find(n => n.Index === edge.Node1);
      // const node2 = nodes.find(n => n.Index === edge.Node2);
      const node1 = nodes[edge.Node1]
      const node2 = nodes[edge.Node2]
      if (node1 && node2) {
        const line = new ol.geom.LineString([
          [node1.Longitude, node1.Latitude],
          [node2.Longitude, node2.Latitude]
        ]);
        line.transform('EPSG:4326', 'EPSG:3857');

        const feature = new ol.Feature({
          geometry: line,
          type: 'edge'
        });

        feature.setStyle(new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#793131ff',
            width: 2
          })
        }));

        vectorSource.addFeature(feature);
      }
    });

    const shouldDrawFinalPath = pathResult && pathResult.paths.length > 1 && (
      !isTracingMode || 
      (isTracingMode && pathResult.traceExecution[currentTraceStep]?.isGoal)
    );
    // Sử dụng biến ở ngay dưới (dòng 314)
    if (shouldDrawFinalPath) {
      for (let i = 0; i < pathResult.paths.length - 1; i++) {
        const current = pathResult.paths[i];
        const next = pathResult.paths[i + 1];

        const line = new ol.geom.LineString([
          [current.geometryX, current.geometryY],
          [next.geometryX, next.geometryY]
        ]);
        line.transform('EPSG:4326', 'EPSG:3857');

        const feature = new ol.Feature({
          geometry: line,
          type: 'path'
        });

        feature.setStyle(new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#3b82f6',  // Màu xanh nước biển
            width: 10
          })
        }));

        vectorSource.addFeature(feature);
      }
    }

    // Get current trace data for node coloring
    let openListNodeIds = [];
    let closeListNodeIds = [];
    let currentVisitNodeId = null;

    if (isTracingMode && pathResult?.traceExecution && pathResult.traceExecution[currentTraceStep]) {
      const traceData = pathResult.traceExecution[currentTraceStep];
      currentVisitNodeId = traceData.visitNode;
      openListNodeIds = (traceData.openList || []).map(item => item.element.nodeId);
      closeListNodeIds = (traceData.closeList || []).map(item => item.element.nodeId);
      
      // Build pathTracing: accumulate all traced paths from step 0 to currentTraceStep
      const tracedPaths = new Set();
      
      for (let stepIndex = 0; stepIndex <= currentTraceStep; stepIndex++) {
        const stepData = pathResult.traceExecution[stepIndex];
        const visitNodeId = stepData.visitNode;
        // const visitNodeData = nodes.find(n => n.Index === visitNodeId);
        const visitNodeData = nodes[visitNodeId];
        
        if (visitNodeData && stepData.openList) {
          stepData.openList.forEach(item => {
            const targetNodeId = item.element.nodeId;
            const parentNodeId = item.element.parent;
            // const targetNodeData = nodes.find(n => n.Index === targetNodeId);
            const targetNodeData = nodes[targetNodeId];
            
            // Chỉ vẽ đường nếu parent của target node là visit node hiện tại
            if (targetNodeData && parentNodeId === visitNodeId) {
              const pathKey = `${visitNodeId}-${targetNodeId}`;
              
              if (!tracedPaths.has(pathKey)) {
                tracedPaths.add(pathKey);
                
                const line = new ol.geom.LineString([
                  [visitNodeData.Longitude, visitNodeData.Latitude],
                  [targetNodeData.Longitude, targetNodeData.Latitude]
                ]);
                line.transform('EPSG:4326', 'EPSG:3857');

                const feature = new ol.Feature({
                  geometry: line,
                  type: 'trace-line'
                });

                feature.setStyle(new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: '#ef4444',
                    width: 3
                  })
                }));

                vectorSource.addFeature(feature);
              }
            }
          });
        }
      }
    }

    // Draw nodes with appropriate colors
    const pathNodeIds = pathResult && !isTracingMode ? pathResult.paths.map(p => p.id) : [];
    const nodeArray = Object.values(nodes);
    nodeArray.forEach(node => {
      const point = new ol.geom.Point([node.Longitude, node.Latitude]);
      point.transform('EPSG:4326', 'EPSG:3857');

      const nodeId = node.Index.toString();
      const isInPath = pathNodeIds.includes(nodeId);
      const isStart = nodeId === startNode;
      const isEnd = nodeId === endNode;
      const isCurrentVisit = isTracingMode && nodeId === currentVisitNodeId?.toString();
      const isInOpenList = isTracingMode && openListNodeIds.includes(node.Index);
      const isInCloseList = isTracingMode && closeListNodeIds.includes(node.Index);

      let fillColor, strokeColor, radius;

      if (isStart) {
        fillColor = '#10b981';
        strokeColor = '#ffffff';
        radius = 8;
      } else if (isEnd) {
        fillColor = '#ef4444';
        strokeColor = '#ffffff';
        radius = 8;
      } else if (isCurrentVisit) {
        fillColor = '#8b5cf6';
        strokeColor = '#ffffff';
        radius = 9;
      } else if (isInCloseList) {
        fillColor = '#22c55e';
        strokeColor = '#ffffff';
        radius = 7;
      } else if (isInOpenList) {
        fillColor = '#f59e0b';
        strokeColor = '#ffffff';
        radius = 7;
      } else if (isInPath) {
        fillColor = '#3b82f6';
        strokeColor = '#ffffff';
        radius = 7;
      } else {
        fillColor = '#6b7280';
        strokeColor = '#ffffff';
        radius = 6;
      }

      const feature = new ol.Feature({
        geometry: point,
        type: 'node',
        nodeId: nodeId
      });

      feature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          fill: new ol.style.Fill({ color: fillColor }),
          stroke: new ol.style.Stroke({
            color: strokeColor,
            width: 2
          })
        }),
        text: new ol.style.Text({
          text: nodeId,
          offsetY: -15,
          font: 'bold 12px sans-serif',
          fill: new ol.style.Fill({ color: '#1f2937' }),
          stroke: new ol.style.Stroke({
            color: '#ffffff',
            width: 3
          })
        })
      }));

      vectorSource.addFeature(feature);
    });

  }, [nodes, edges, pathResult, startNode, endNode, mapLoaded, isTracingMode, currentTraceStep]);

  const findPath = async () => {
    if (!startNode || !endNode) {
      setError('Vui lòng chọn cả node bắt đầu và kết thúc');
      return;
    }

    if (startNode === endNode) {
      setError('Node bắt đầu và kết thúc phải khác nhau');
      return;
    }

    setLoading(true);
    setError('');
    dispatch(setPathResult(null));
    setIsTracingMode(false);
    setCurrentTraceStep(0);
    

    let result;
    try {
      switch (algorithm) {
        case "Astar":
          console.log("A*")
          result = Astar(graph, nodes, edges, startNode, endNode, heuristic);
          break;
        case "UCS":
          result = UCS(graph, nodes, edges, startNode, endNode);
          break;
          case "Greedy":
          result = Greedy(graph, nodes, edges, startNode, endNode, heuristic);
          break;
          case "HillClimbing":
          result = HillClimbing(graph, nodes, edges, startNode, endNode, heuristic);
          break;
        default:
          console.log(algorithm, "Not found Algorithm")
      }
      if (result.totalDistance === Infinity) {
        throw new Error('Không tìm thấy đường đi giữa 2 node này');
      }
      dispatch(setPathResult(result));
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    dispatch(resetAll());
    setError('');
    setIsTracingMode(false);
    setCurrentTraceStep(0);
  };

  // Trace navigation functions
  const handleFirst = () => setCurrentTraceStep(0);
  const handlePrevious = () => setCurrentTraceStep(Math.max(0, currentTraceStep - 1));
  const handleNext = () => setCurrentTraceStep(Math.min(pathResult.traceExecution.length - 1, currentTraceStep + 1));
  const handleLast = () => setCurrentTraceStep(pathResult.traceExecution.length - 1);
  const toggleTracingMode = () => {
    setIsTracingMode(!isTracingMode);
    setCurrentTraceStep(0);
  };

  // console.log("edges", edges)
  // console.log(nodes)
  const nodeArray = Object.values(nodes);
  const nodeOptions = nodeArray
    .map(n => n.Index.toString())
    .sort((a, b) => parseInt(a) - parseInt(b));
  // const nodeOptions = nodes.map(n => n.Index.toString()).sort((a, b) => parseInt(a) - parseInt(b));
  const maxStep = pathResult?.traceExecution ? pathResult.traceExecution.length - 1 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">CPF - CTU PATHFINDING</h1>
          {/* <p className="text-slate-600">Tìm đường đi ngắn nhất giữa các node với nhiều thuật toán khác nhau</p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload Dữ Liệu CSV</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Nodes (Index, Longitude, Latitude)
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={nodeFileRef}
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, 'nodes')}
                      className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadedFiles.nodes && (
                      <button
                        onClick={() => clearFile('nodes')}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {uploadedFiles.nodes && (
                    <p className="text-xs text-green-600 mt-1">✓ {uploadedFiles.nodes}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Edges (Index, Node1, Node2, Weight)
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={edgeFileRef}
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, 'edges')}
                      className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadedFiles.edges && (
                      <button
                        onClick={() => clearFile('edges')}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {uploadedFiles.edges && (
                    <p className="text-xs text-green-600 mt-1">✓ {uploadedFiles.edges}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    <Upload className="w-3 h-3 inline mr-1" />
                    Tải lên file CSV của bạn hoặc sử dụng dữ liệu mặc định
                  </p>
                </div>
              </div>
            </div>

            {/* Pathfinding Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Tùy Chọn Tìm Đường</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Thuật Toán
                  </label>
                  <select
                    value={algorithm}
                    onChange={(e) => {
                      dispatch(setAlgorithm(e.target.value))
                      dispatch(resetPathResult())
                      
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Astar">A*</option>
                    <option value="UCS">UCS</option>
                    <option value="Greedy">Greedy</option>
                    <option value="HillClimbing">Hill Climbing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Node Bắt Đầu
                  </label>
                  <select
                    value={startNode}
                    onChange={(e) => dispatch(setStartNode(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chọn node bắt đầu</option>
                    {nodeOptions.map(idx => (
                      <option key={idx} value={idx}>Node {idx}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Node Kết Thúc
                  </label>
                  <select
                    value={endNode}
                    onChange={(e) => dispatch(setEndNode(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Chọn node kết thúc</option>
                    {nodeOptions.map(idx => (
                      <option key={idx} value={idx}>Node {idx}</option>
                    ))}
                  </select>
                </div>
                {
                  algorithm && algorithm != "UCS" ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Heuristic
                      </label>
                      <select
                        value={heuristic}
                        onChange={(e) => setHeuristic(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        {/* <option value="None">None</option> */}
                        <option value="euclidean">Euclidean</option>
                        <option value="manhattan">Manhattan</option>
                        {/* <option value="haversine">Haversine</option> */}
                      </select>
                  </div>
                  ) : (<p></p>)
                }
                <div className="flex gap-2">
                  <button
                    onClick={findPath}
                    disabled={loading || !startNode || !endNode}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Tìm Đường
                      </>
                    )}
                  </button>
                  <button
                    onClick={reset}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Results Panel */}
            {pathResult && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Kết Quả</h2>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-slate-600">Tổng Khoảng Cách</p>
                    <p className="text-2xl font-bold text-blue-600">{pathResult.totalDistance && pathResult.totalDistance.toFixed(2)}m</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-sm text-slate-600">Thời Gian Thực Thi</p>
                    <p className="text-lg font-semibold text-slate-700">{pathResult.executeTime}</p>
                  </div>
                  {
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-sm text-slate-600 mb-2">Chuỗi Đường Đi</p>
                    <div className="flex flex-wrap gap-1">
                      {
                        pathResult.traceExecution[pathResult.traceExecution.length - 1].stuck === true ? (
                          <span
                            className="inline-flex items-center px-2 py-1 bg-blue-100 text-red-700 text-xs font-medium rounded"
                          >
                            {pathResult.traceExecution[pathResult.traceExecution.length - 1].message}
                          </span>
                        ) : (
                          pathResult.paths.slice().map((p, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                            >
                              {p.id}
                            </span>
                          ))
                        )
                      }
                    </div>

                  </div>
                  }
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-slate-600">Thuật Toán Sử Dụng</p>
                    <p className="text-sm font-semibold text-green-700">{algorithm}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Chú Thích</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  <span className="text-sm text-slate-700">Node Bắt Đầu</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                  <span className="text-sm text-slate-700">Node Kết Thúc</span>
                </div>
                {isTracingMode && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
                      <span className="text-sm text-slate-700">Node Đang Duyệt</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white"></div>
                      <span className="text-sm text-slate-700">Open List</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      <span className="text-sm text-slate-700">Close List</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-0.5 bg-red-500"></div>
                      <span className="text-sm text-slate-700">Đường Duyệt (Visit → Open)</span>
                    </div>
                  </>
                )}
                {!isTracingMode && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-0.5 bg-blue-500"></div>
                    <span className="text-sm text-slate-700">Đường Đi Ngắn Nhất</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div
                ref={mapRef}
                className="w-full h-[725px] border border-slate-200 rounded-lg overflow-hidden"
                style={{ position: 'relative' }}
              />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-slate-600">Đang tải bản đồ...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Trace Execution Section */}
            {pathResult && pathResult.traceExecution && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Trace Execution - {algorithm}</h2>
                  {algorithm !== "HillClimbing" && 
                  <button
                    onClick={toggleTracingMode}
                    className={`px-4 py-2 rounded-lg font-medium  ${
                      isTracingMode
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    <p className='text-slate-700'>{isTracingMode ? 'Tracing Mode ON' : 'Enable Tracing'}</p>
                  </button>
                   }
                </div>

                {isTracingMode && (
                  <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleFirst}
                        disabled={currentTraceStep === 0}
                        className="p-2 bg-white hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 text-blue-600 rounded-lg transition-colors shadow-sm"
                        title="Bước đầu tiên"
                      >
                        <ChevronsLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handlePrevious}
                        disabled={currentTraceStep === 0}
                        className="p-2 bg-white hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 text-blue-600 rounded-lg transition-colors shadow-sm"
                        title="Bước trước"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentTraceStep === maxStep}
                        className="p-2 bg-white hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 text-blue-600 rounded-lg transition-colors shadow-sm"
                        title="Bước tiếp theo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleLast}
                        disabled={currentTraceStep === maxStep}
                        className="p-2 bg-white hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 text-blue-600 rounded-lg transition-colors shadow-sm"
                        title="Bước cuối cùng"
                      >
                        <ChevronsRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-700">
                        Bước <span className="text-blue-600 font-bold">{currentTraceStep}</span> / {maxStep}
                      </div>
                      {pathResult.traceExecution[currentTraceStep]?.isGoal && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          🎯 Đã tìm thấy đích
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <MyTable 
                  traceExecution={pathResult.traceExecution} 
                  currentStep={currentTraceStep}
                  algorithm={algorithm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathfindingVisualizer4;