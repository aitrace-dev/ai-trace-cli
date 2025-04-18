import "@/styles/workflow.css";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  FitViewOptions,
  MarkerType,
  MiniMap,
  NodeTypes,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";

import AgentNode from "./AgentNode";
import ExecutionNode from "./ExecutionNode";
import InputNode from "./InputNode";
import TaskNode from "./TaskNode";
import ToolNode from "./ToolNode";

const proOptions = { hideAttribution: true };
// Node types definition
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  execution: ExecutionNode,
  task: TaskNode,
  agentInput: InputNode,
};

const fitViewOptions: FitViewOptions = {
  padding: 0, // No padding to remove margin/offset
  minZoom: 0.3,
  maxZoom: 1.5,
};

// Default workflow data when not in local development mode
const CREW_AI_WORKFLOW = {};

// Function to arrange nodes in the correct flow order using dagre
const getLayoutedElements = (nodes: any[], edges: any[]) => {
  // Group nodes by type
  const nodesByType: Record<string, any[]> = {
    'agentInput': [],
    'task': [],
    'agent': [],
    'tool': []
  };

  // Collect nodes by their types
  nodes.forEach(node => {
    if (nodesByType[node.type]) {
      nodesByType[node.type].push(node);
    }
  });

  // Find starting input node, tasks, agents, and tools
  const startingInput = nodes.find(node => node.type === 'agentInput' && node.is_starting_node === true);
  const startingTask = nodes.find(node => node.type === 'task' && node.is_starting_node === true);
  const inputs = nodesByType['agentInput'];
  const tasks = nodesByType['task'];
  const agents = nodesByType['agent'];
  const tools = nodesByType['tool'];

  // Create a map to track connections between nodes
  const connectionMap: Record<string, string[]> = {};
  const reverseConnectionMap: Record<string, string[]> = {};
  
  // Initialize the connection maps
  nodes.forEach(node => {
    connectionMap[node.id] = [];
    reverseConnectionMap[node.id] = [];
  });

  // Populate connection maps
  edges.forEach(edge => {
    const sourceId = edge.source;
    const targetId = edge.target;
    connectionMap[sourceId].push(targetId);
    reverseConnectionMap[targetId].push(sourceId);
  });

  // Define node dimensions
  const nodeWidth = {
    'agentInput': 320,
    'task': 320,
    'agent': 320,
    'tool': 280
  };

  const nodeHeight = {
    'agentInput': 180,
    'task': 340,
    'agent': 280,
    'tool': 180
  };

  // Define Y positions for each node type
  const yPositions = {
    'agentInput': 100,
    'task': 100,
    'agent': 500
  };

  // Vertical spacing between node types
  const verticalSpacing = 120;
  
  // Horizontal spacing between nodes
  const horizontalSpacing = 400;
  
  // Create a copy of the nodes array for positioning
  const layoutedNodes = [...nodes];
  
  // Step 1: Position the input node (starting node) at the leftmost position
  if (startingInput) {
    const inputNode = layoutedNodes.find(node => node.id === startingInput.id);
    if (inputNode) {
      inputNode.position = {
        x: 100,
        y: yPositions['agentInput']
      };
    }
  } else if (inputs.length > 0) {
    // If no starting input is specified, use the first input node
    const inputNode = layoutedNodes.find(node => node.id === inputs[0].id);
    if (inputNode) {
      inputNode.position = {
        x: 100,
        y: yPositions['agentInput']
      };
    }
  }
  
  // Step 2: Position task nodes at the same Y level but separated horizontally
  // Find tasks connected to the input node
  let connectedTasks: any[] = [];
  if (startingInput) {
    connectedTasks = tasks.filter(task => 
      connectionMap[startingInput.id].includes(task.id) || 
      reverseConnectionMap[task.id].includes(startingInput.id)
    );
  }
  
  // If there are connected tasks, position them first
  if (connectedTasks.length > 0) {
    connectedTasks.forEach((task, index) => {
      const taskNode = layoutedNodes.find(node => node.id === task.id);
      if (taskNode) {
        taskNode.position = {
          x: 500 + (index * horizontalSpacing),
          y: yPositions['task']
        };
      }
    });
    
    // Position any remaining tasks
    const remainingTasks = tasks.filter(task => !connectedTasks.includes(task));
    remainingTasks.forEach((task, index) => {
      const taskNode = layoutedNodes.find(node => node.id === task.id);
      if (taskNode) {
        taskNode.position = {
          x: 500 + ((connectedTasks.length + index) * horizontalSpacing),
          y: yPositions['task']
        };
      }
    });
  } else {
    // If no connected tasks, position all tasks sequentially
    tasks.forEach((task, index) => {
      const taskNode = layoutedNodes.find(node => node.id === task.id);
      if (taskNode) {
        taskNode.position = {
          x: 500 + (index * horizontalSpacing),
          y: yPositions['task']
        };
      }
    });
  }
  
  // Step 3: Position agents below their connected tasks
  agents.forEach(agent => {
    const agentNode = layoutedNodes.find(node => node.id === agent.id);
    if (agentNode) {
      // Find tasks connected to this agent
      const connectedTaskIds = [...connectionMap[agent.id], ...reverseConnectionMap[agent.id]]
        .filter(id => {
          const node = layoutedNodes.find(n => n.id === id);
          return node && node.type === 'task';
        });
      
      if (connectedTaskIds.length > 0) {
        // Position agent below the first connected task
        const connectedTask = layoutedNodes.find(node => node.id === connectedTaskIds[0]);
        if (connectedTask) {
          agentNode.position = {
            x: connectedTask.position.x,
            y: yPositions['agent']
          };
        }
      } else {
        // If no connected tasks, position at a default location
        agentNode.position = {
          x: 500,
          y: yPositions['agent']
        };
      }
    }
  });
  
  // Step 4: Position tools below their connected agents
  // Create a map to track tools per agent to prevent overlapping
  const toolsPerAgent: Record<string, number> = {};
  
  tools.forEach(tool => {
    const toolNode = layoutedNodes.find(node => node.id === tool.id);
    if (toolNode) {
      // Find agents connected to this tool
      const connectedAgentIds = [...connectionMap[tool.id], ...reverseConnectionMap[tool.id]]
        .filter(id => {
          const node = layoutedNodes.find(n => n.id === id);
          return node && node.type === 'agent';
        });
      
      if (connectedAgentIds.length > 0) {
        // Position tool below the first connected agent
        const connectedAgent = layoutedNodes.find(node => node.id === connectedAgentIds[0]);
        if (connectedAgent) {
          // Initialize tool count for this agent if not already done
          if (!toolsPerAgent[connectedAgent.id]) {
            toolsPerAgent[connectedAgent.id] = 0;
          }
          
          // Increment the tool count for this agent
          toolsPerAgent[connectedAgent.id]++;
          
          // Center the tool below the agent
          const toolWidth = nodeWidth['tool'];
          const agentWidth = nodeWidth['agent'];
          const xOffset = (agentWidth - toolWidth) / 2;
          
          // Calculate Y position based on agent's position and height plus spacing
          // Stack tools vertically with additional spacing for each subsequent tool
          const baseToolY = connectedAgent.position.y + nodeHeight['agent'] + verticalSpacing;
          const toolIndex = toolsPerAgent[connectedAgent.id] - 1; // 0-based index
          const verticalToolSpacing = 20; // Additional space between stacked tools
          const toolY = baseToolY + (toolIndex * (nodeHeight['tool'] + verticalToolSpacing));
          
          toolNode.position = {
            x: connectedAgent.position.x + xOffset,
            y: toolY
          };
        }
      } else {
        // If no connected agents, position at a default location
        toolNode.position = {
          x: 500,
          y: yPositions['agent'] + nodeHeight['agent'] + verticalSpacing
        };
      }
    }
  });
  
  return { nodes: layoutedNodes, edges };
};

const AgentWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Load workflow data from JSON file or constant
  useEffect(() => {
    const loadWorkflowData = async () => {
      try {
        setIsLoading(true);
        
        let data;
        // Check if we're in local development mode
        if (import.meta.env.VITE_ENV === 'local') {
          // In local development mode, load from file
          console.log('Loading workflow from file in local mode');
          const response = await fetch('/data/workflow.json');
          data = await response.json();
        } else {
          // In production or other environments, use the constant
          console.log('Using built-in CREW_AI_WORKFLOW constant');
          data = CREW_AI_WORKFLOW;
        }

        // Process nodes to ensure they have the correct types
        const processedNodes = data.nodes.map((node: any) => ({
          ...node,
          // Ensure MarkerType is correctly applied if needed
        }));

        // Process edges to ensure MarkerType is correctly applied
        const processedEdges = data.edges.map((edge: any) => ({
          ...edge,
          markerEnd: edge.markerEnd ? {
            ...edge.markerEnd,
            type: MarkerType[edge.markerEnd.type.toUpperCase() as keyof typeof MarkerType]
          } : undefined,
        }));

        // Apply layout algorithm
        const { nodes: layoutedNodes, edges: layoutedEdges } = 
          getLayoutedElements(processedNodes, processedEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } catch (error) {
        console.error("Error loading workflow data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflowData();
  }, []);

  // Apply custom zoom level after the flow is initialized
  useEffect(() => {
    if (rfInstance && !isLoading) {
      // Set the custom zoom level directly without fitting the view first
      rfInstance.zoomTo(0.8);

      // Set the viewport to start from the top-left corner (0,0)
      rfInstance.setViewport({ x: 0, y: 0, zoom: 0.8 });
    }
  }, [rfInstance, isLoading]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => 
        addEdge({
          ...connection,
          animated: true,
          style: { stroke: "#3b82f6", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#3b82f6",
          }
        }, eds)
      );
    },
    [setEdges]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading workflow...</div>;
  }

  return (
    <div className="h-full w-full" style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView={false}
        fitViewOptions={fitViewOptions}
        minZoom={0.1}
        maxZoom={2}
        onInit={onInit}
        proOptions={proOptions}
        className="bg-slate-50"
        style={{ height: '100%' }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default AgentWorkflow;
