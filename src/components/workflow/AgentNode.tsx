
import { Handle, Position } from "@xyflow/react";

interface AgentNodeProps {
  data: {
    role: string;
    goal: string;
    backstory: string;
  };
}

const AgentNode = ({ data }: AgentNodeProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-500 min-w-[250px]">
      <div className="bg-blue-100 -m-4 mb-3 p-2 rounded-t-lg border-b border-blue-500">
        <div className="text-blue-800 font-bold text-sm uppercase">Agent</div>
      </div>
      <div className="font-bold text-lg mb-2">{data.role}</div>
      <div className="text-sm mb-2">
        <span className="font-semibold block text-blue-700">Goal:</span>
        <p className="text-gray-700">{data.goal}</p>
      </div>
      <div className="text-sm">
        <span className="font-semibold block text-blue-700">Backstory:</span>
        <p className="text-gray-700">{data.backstory}</p>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};

export default AgentNode;
