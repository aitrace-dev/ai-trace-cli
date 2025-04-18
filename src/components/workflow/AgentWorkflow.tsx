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
import dagre from "dagre";

import AgentNode from "./AgentNode";
import ExecutionNode from "./ExecutionNode";
import TaskNode from "./TaskNode";
import ToolNode from "./ToolNode";

// Node types definition
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  execution: ExecutionNode,
  task: TaskNode,
};

const fitViewOptions: FitViewOptions = {
  padding: 0, // No padding to remove margin/offset
  minZoom: 0.3,
  maxZoom: 1.5,
};

// Function to arrange nodes in the correct flow order using dagre
const getLayoutedElements = (nodes: any[], edges: any[]) => {
  // Create a new dagre graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set the rankdir to TB (top to bottom)
  dagreGraph.setGraph({ 
    rankdir: 'TB',
    align: 'UL',
    nodesep: 80,
    ranksep: 200,
    marginx: 20,
    marginy: 20
  });

  // Group nodes by type
  const nodesByType: Record<string, any[]> = {
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

  // Find tasks, agents, and tools
  const startingTask = nodes.find(node => node.type === 'task' && node.is_starting_node === true);
  const tasks = nodesByType['task'];
  const agents = nodesByType['agent'];
  const tools = nodesByType['tool'];

  // Create a clean adjacency map to track connections
  const adjacencyMap: Record<string, string[]> = {};

  // Initialize the adjacency map
  nodes.forEach(node => {
    adjacencyMap[node.id] = [];
  });

  // Populate adjacency map
  edges.forEach(edge => {
    const sourceId = edge.source;
    const targetId = edge.target;
    adjacencyMap[sourceId].push(targetId);
  });

  // Define node size based on type
  const nodeWidth = {
    'task': 320,
    'agent': 320,
    'tool': 280
  };

  const nodeHeight = {
    'task': 340,
    'agent': 280,
    'tool': 180
  };

  // Set ranks for dagre to ensure correct vertical ordering
  if (startingTask) {
    // Set the starting task as rank 0
    dagreGraph.setNode(startingTask.id, { 
      width: nodeWidth['task'],
      height: nodeHeight['task'],
      rank: 0
    });

    // Process all nodes connected to the starting task first
    const processAllConnectedNodes = (nodeId: string, visited: Set<string> = new Set()) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const connectedNodeIds = adjacencyMap[nodeId] || [];

      connectedNodeIds.forEach(connectedId => {
        const connectedNode = nodes.find(n => n.id === connectedId);
        if (connectedNode) {
          if (!dagreGraph.hasNode(connectedId)) {
            dagreGraph.setNode(connectedId, {
              width: nodeWidth[connectedNode.type as keyof typeof nodeWidth],
              height: nodeHeight[connectedNode.type as keyof typeof nodeHeight]
            });
          }

          processAllConnectedNodes(connectedId, visited);
        }
      });
    };

    processAllConnectedNodes(startingTask.id);

    // Add any remaining tasks that weren't connected to the starting task
    tasks.forEach(task => {
      if (!dagreGraph.hasNode(task.id)) {
        dagreGraph.setNode(task.id, {
          width: nodeWidth['task'],
          height: nodeHeight['task']
        });
      }
    });
  } else {
    // If no starting task, just add all tasks
    tasks.forEach(task => {
      dagreGraph.setNode(task.id, {
        width: nodeWidth['task'],
        height: nodeHeight['task']
      });
    });
  }

  // Add all remaining agents that haven't been added
  agents.forEach(agent => {
    if (!dagreGraph.hasNode(agent.id)) {
      dagreGraph.setNode(agent.id, {
        width: nodeWidth['agent'],
        height: nodeHeight['agent']
      });
    }
  });

  // Add all remaining tools that haven't been added
  tools.forEach(tool => {
    if (!dagreGraph.hasNode(tool.id)) {
      dagreGraph.setNode(tool.id, {
        width: nodeWidth['tool'],
        height: nodeHeight['tool']
      });
    }
  });

  // Add all edges
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run the layout
  dagre.layout(dagreGraph);

  // Adjust Y positions to ensure tasks are at the top, agents in the middle, and tools at the bottom
  const yPositions = {
    'task': 100,
    'agent': 500,
    'tool': 800
  };

  // Apply the layout to the nodes
  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = { ...node };
    if (dagreGraph.hasNode(node.id)) {
      // Get position from dagre for X, but use fixed Y based on node type
      const dagreNode = dagreGraph.node(node.id);
      nodeWithPosition.position = {
        x: dagreNode.x - nodeWidth[node.type as keyof typeof nodeWidth] / 2,
        y: yPositions[node.type as keyof typeof yPositions]
      };
    }
    return nodeWithPosition;
  });

  return { nodes: layoutedNodes, edges };
};

const AgentWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Load workflow data from JSON file
  useEffect(() => {
    const loadWorkflowData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/workflow.json');
        const data = await response.json();

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
    <div className="h-full w-full">
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
        className="bg-slate-50"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default AgentWorkflow;
