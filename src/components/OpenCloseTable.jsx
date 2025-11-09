

export function MyTable() {
  return (
    <table className="min-w-full border border-gray-300 text-sm rounded-xl shadow-sm overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
            <tr>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Number</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">X</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Open</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Close</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-blue-50">
            <td className="border border-gray-200 px-4 py-2 text-center">1</td>
            <td className="border border-gray-200 px-4 py-2 text-gray-800">_</td>
            <td className="border border-gray-200 px-4 py-2 text-gray-800">Node 1 (0, parent)</td>
            <td className="border border-gray-200 px-4 py-2 text-gray-800">_</td>
            </tr>
            <tr className="hover:bg-blue-50">
            <td className="border border-gray-200 px-4 py-2 text-center">2</td>
            <td className="border border-gray-200 px-4 py-2 text-gray-800">Node 1 (0, parent)</td>
            <td className="border border-gray-200 px-4 py-2 text-gray-800">
                Node 2 (5, Node 1), Node 3 (6, Node 1), Node 3 (6, Node 1)
            </td>
            <td className="border border-gray-200 px-4 py-2 text-gray-800">
                Node 3 (6, Node 1), Node 3 (6, Node 1)
            </td>
            </tr>
        </tbody>
    </table>

  );
}
