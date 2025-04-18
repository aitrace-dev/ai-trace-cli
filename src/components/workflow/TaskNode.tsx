import { Handle, Position } from "@xyflow/react";

interface TaskNodeProps {
  data: {
    name: string;
    description?: string;
    expected_output?: string;
    output_file?: string;
  };
}

const TaskNode = ({ data }: TaskNodeProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-amber-500 min-w-[250px]">
      <div className="bg-amber-100 -m-4 mb-3 p-2 rounded-t-lg border-b border-amber-500">
        <div className="text-amber-800 font-bold text-sm uppercase">Task</div>
      </div>
      <div className="font-bold text-lg mb-2">{data.name}</div>
      
      {data.description && (
        <div className="text-sm mb-2">
          <span className="font-semibold block text-amber-700">Description:</span>
          <p className="text-gray-700">{data.description}</p>
        </div>
      )}
      
      {data.expected_output && (
        <div className="text-sm mb-2">
          <span className="font-semibold block text-amber-700">Expected Output:</span>
          <p className="text-gray-700">{data.expected_output}</p>
        </div>
      )}
      
      {data.output_file && (
        <div className="text-sm">
          <span className="font-semibold block text-amber-700">Output File:</span>
          <p className="text-gray-700">{data.output_file}</p>
        </div>
      )}
      
      {/* Top handle - supports both source and target with the same ID */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Left handle - supports both source and target with the same ID */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Right handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Bottom handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-amber-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
    </div>
  );
};

export default TaskNode;
