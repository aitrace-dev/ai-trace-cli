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
  padding: 0.2, // Slightly increased padding for better view
  minZoom: 0.3,
  maxZoom: 1.5,
};

// More accurate node dimensions based on the screenshot
const nodeDimensions = {
  'task': { width: 320, height: 340 },    // Task nodes are much taller
  'agent': { width: 320, height: 280 },   // Agent nodes are also taller
  'tool': { width: 280, height: 180 }     // Tool nodes 
};

// Function to arrange nodes in horizontal rows by type
const getLayoutedElements = (nodes: any[], edges: any[]) => {
  // Define the order of rows
  const rowOrder = ['task', 'agent', 'tool'];
  const verticalPadding = 150; // Space between rows - significant increase to prevent overlap
  
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
  
  // Position nodes in rows with proper horizontal spacing
  const layoutedNodes = [...nodes];
  
  // Track the Y position for each row
  let currentY = 50;  // Start at 50px from the top
  
  // Process each type of node in order
  rowOrder.forEach(type => {
    const typeNodes = nodesByType[type];
    if (typeNodes.length === 0) return;
    
    const nodeWidth = nodeDimensions[type as keyof typeof nodeDimensions].width;
    const nodeHeight = nodeDimensions[type as keyof typeof nodeDimensions].height;
    const spacing = 300; // Increased spacing between nodes to prevent horizontal overlap
    
    // Calculate total width needed for this row
    const totalWidth = typeNodes.length * nodeWidth + (typeNodes.length - 1) * spacing;
    // Calculate starting X position to center the row
    let startX = 500 - (totalWidth / 2);
    
    if (typeNodes.length === 1) {
      // If there's only one node of this type, center it
      startX = 500 - (nodeWidth / 2);
    }
    
    // Position each node in the row
    typeNodes.forEach((node, index) => {
      const nodeIndex = layoutedNodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        layoutedNodes[nodeIndex] = {
          ...layoutedNodes[nodeIndex],
          position: {
            x: startX + (index * (nodeWidth + spacing)),
            y: currentY
          }
        };
      }
    });
    
    // Update the current Y position for the next row
    // Use the actual height of the current node type plus padding
    currentY += nodeHeight + verticalPadding;
  });
  
  // Use dagre for edge routing only
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });
  
  // Add nodes to the dagre graph (for edge routing)
  layoutedNodes.forEach(node => {
    const { width, height } = nodeDimensions[node.type as keyof typeof nodeDimensions];
    dagreGraph.setNode(node.id, {
      width,
      height,
      x: node.position.x + (width / 2),
      y: node.position.y + (height / 2)
    });
  });
  
  // Add edges
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  // Process the edges with dagre (but preserve node positions)
  dagre.layout(dagreGraph);
  
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

        // Apply automatic layout
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
        fitView={true}
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
