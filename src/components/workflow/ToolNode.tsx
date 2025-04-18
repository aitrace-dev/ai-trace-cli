import { Handle, Position } from "@xyflow/react";

interface ToolNodeProps {
  data: {
    name: string;
    description?: string;
  };
}

const ToolNode = ({ data }: ToolNodeProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-green-500 min-w-[200px]">
      <div className="bg-green-100 -m-4 mb-3 p-2 rounded-t-lg border-b border-green-500">
        <div className="text-green-800 font-bold text-sm uppercase">Tool</div>
      </div>
      <div className="font-bold text-lg mb-1">{data.name}</div>
      {data.description && (
        <div className="text-sm text-gray-700">{data.description}</div>
      )}
      
      {/* Top handle - supports both source and target with the same ID */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Left handle - supports both source and target with the same ID */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Right handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Bottom handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
    </div>
  );
};

export default ToolNode;
