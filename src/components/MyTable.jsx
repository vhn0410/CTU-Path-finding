export const MyTable = ({ traceExecution, currentStep, algorithm}) => {
  if (!traceExecution || traceExecution.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Chưa có dữ liệu trace execution. Vui lòng chạy thuật toán trước.</p>
      </div>
    );
  }

  // Get all steps from 0 to currentStep
  const displayedSteps = traceExecution.slice(0, currentStep + 1);
  const currentData = traceExecution[currentStep];
  const FormatNodeFunction = (algorithm_type, node) => {
    // console.log(algorithm_type, node )
    switch (algorithm_type) {
            case "Astar":
              return (
                <>
                  {' '}({node.cost.toFixed(2)}, {node.heuristicx.toFixed(2)}, {node.fx.toFixed(2)}, {node.parent === -1 ? 'root' : `Node ${node.parent}`})
                </>
              )
              break;
            case "UCS":
              return (
                <>
                  {' '}({node.cost.toFixed(2)}, {node.parent === -1 ? 'root' : `Node ${node.parent}`})
                </>
              )
              break;
              case "Greedy":
              (
                <>
                  {' '}({node.cost.toFixed(2)}, {node.heuristicx.toFixed(2)}, {node.parent === -1 ? 'root' : `Node ${node.parent}`})
                </>
              )
              break;
            case "Hill Climbing":
              console.log("Hill Climbing")
              break;
            default:
              console.log(algorithm, "Not found Algorithm")
    }
  }
  const formatNodeList = (nodeList) => {
    if (!nodeList || nodeList.length === 0) return '_';

    return nodeList.map((item, index) => {
      const node = item.element;
      return (
        <span key={index} className="mr-1">
          <strong className="text-blue-600">Node {node.nodeId}</strong>
          <span className="text-gray-600">
            

          
          {
            FormatNodeFunction(algorithm, node)            
           }
            
          </span>
          {index < nodeList.length - 1 && <br></br>}
        </span>
      );
    });
  };
  
  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full border border-gray-300 text-sm rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Step</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Visit Node (X)</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Open List <br></br> {"Node (g(x), h(x), f(x), parent)"}</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Close List</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {displayedSteps.map((stepData, index) => (
              <tr 
                key={index} 
                className={`hover:bg-blue-50 transition-colors ${
                  index === currentStep ? 'bg-blue-100' : ''
                }`}
              >
                <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-blue-600">
                  {stepData.step}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-gray-800">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full">
                    Node {stepData.visitNode}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  <div className="max-h-20 overflow-y-auto text-xs">
                    {formatNodeList(stepData.openList)}
                  </div>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  <div className="max-h-20 overflow-y-auto text-xs">
                    {formatNodeList(stepData.closeList)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-gray-600 mb-1">Open List Size</p>
          <p className="text-xl font-bold text-blue-600">
            {currentData.openList ? currentData.openList.length : 0}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-gray-600 mb-1">Close List Size</p>
          <p className="text-xl font-bold text-green-600">
            {currentData.closeList ? currentData.closeList.length : 0}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-gray-600 mb-1">Total Steps</p>
          <p className="text-xl font-bold text-purple-600">
            {traceExecution.length}
          </p>
        </div>
      </div>
    </div>
  );
};