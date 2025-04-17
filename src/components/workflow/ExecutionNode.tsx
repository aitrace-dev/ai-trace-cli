
import { Handle, Position } from "@xyflow/react";

interface ExecutionNodeProps {
  data: {
    task: string;
    status?: "running" | "completed" | "error";
    result?: string;
  };
}

const ExecutionNode = ({ data }: ExecutionNodeProps) => {
  const statusColors = {
    running: "bg-yellow-100 border-yellow-500 text-yellow-800",
    completed: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
  };

  const statusColor = data.status 
    ? statusColors[data.status] 
    : "bg-gray-100 border-gray-500 text-gray-800";

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-2 border-purple-500 min-w-[220px]`}>
      <div className="bg-purple-100 -m-4 mb-3 p-2 rounded-t-lg border-b border-purple-500">
        <div className="text-purple-800 font-bold text-sm uppercase">Execution</div>
      </div>
      <div className="font-bold text-lg mb-2">{data.task}</div>
      
      {data.status && (
        <div className={`text-sm font-medium inline-block px-2 py-1 rounded-full ${statusColor} mb-2`}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </div>
      )}
      
      {data.result && (
        <div className="text-sm mt-2">
          <span className="font-semibold block text-purple-700">Result:</span>
          <p className="text-gray-700 bg-gray-50 p-2 rounded overflow-auto max-h-32">
            {data.result}
          </p>
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </div>
  );
};

export default ExecutionNode;
