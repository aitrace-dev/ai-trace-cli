import { Handle, Position } from "@xyflow/react";

interface InputNodeProps {
  data: {
    name: string;
    variables: string[];
  };
}

const InputNode = ({ data }: InputNodeProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-500 min-w-[250px] relative">
      <div className="bg-blue-100 -m-4 mb-3 p-2 rounded-t-lg border-b border-blue-500">
        <div className="text-blue-800 font-bold text-sm uppercase">Input</div>
      </div>
      <div className="font-bold text-lg mb-2">{data.name}</div>
      
      {data.variables && data.variables.length > 0 && (
        <div className="text-sm">
          <span className="font-semibold block text-blue-700 mb-1">Variables:</span>
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
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 1, top: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="in"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 2, top: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
      
      {/* Left handle - supports both source and target with the same ID */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 1, left: -4, top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 2, left: -4, top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Right handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 1, right: -4, top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 2, right: -4, top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Bottom handle - supports both source and target with the same ID */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 1, bottom: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="out"
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ zIndex: 2, bottom: -4, left: '50%', transform: 'translateX(-50%)' }}
      />
    </div>
  );
};

export default InputNode;
