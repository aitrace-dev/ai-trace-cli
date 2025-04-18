import { Handle, Position } from "@xyflow/react";

interface InputNodeProps {
  data: {
    name: string;
    variables: string[];
  };
}

const InputNode = ({ data }: InputNodeProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-500 min-w-[250px]">
      <div className="bg-purple-100 -m-4 mb-3 p-2 rounded-t-lg border-b border-purple-500">
        <div className="text-purple-800 font-bold text-sm uppercase">Input</div>
      </div>
      <div className="font-bold text-lg mb-2">{data.name}</div>
      
      {data.variables && data.variables.length > 0 && (
        <div className="text-sm">
          <span className="font-semibold block text-purple-700 mb-1">Variables:</span>
          <div className="max-h-[200px] overflow-y-auto">
            <ul className="list-disc pl-5">
              {data.variables.map((variable, index) => (
                <li key={index} className="mb-1 text-gray-700">
                  {variable}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
            
      {/* Top handle - supports both source and target with the same ID */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Left handle - supports both source and target with the same ID */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Right handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
      
      {/* Bottom handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 1 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ zIndex: 2 }}
      />
    </div>
  );
};

export default InputNode;
