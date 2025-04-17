
import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@/styles/workflow.css";

import AgentNode from "./AgentNode";
import ToolNode from "./ToolNode";
import ExecutionNode from "./ExecutionNode";

// Sample initial data based on the execution logs
const initialNodes: Node[] = [
  {
    id: "agent-1",
    type: "agent",
    position: { x: 250, y: 50 },
    data: {
      role: "Research Analyst",
      goal: "Find and summarize information about specific topics",
      backstory: "You are an experienced researcher with attention to detail",
    },
  },
  {
    id: "tool-1",
    type: "tool",
    position: { x: 250, y: 250 },
    data: { 
      name: "SerperDevTool",
      description: "Search the internet with Serper" 
    },
  },
  {
    id: "execution-1",
    type: "execution",
    position: { x: 50, y: 400 },
    data: { 
      task: "Search: capital of France",
      status: "completed",
      result: "The capital of France is Paris."
    },
  },
  {
    id: "execution-2",
    type: "execution",
    position: { x: 450, y: 400 },
    data: { 
      task: "Research climate change",
      status: "running"
    },
  }
];

// Updated edges to show the correct sequence with numbers
const initialEdges: Edge[] = [
  // Step 1: Agent decides to use tool
  {
    id: "edge-agent-to-tool",
    source: "agent-1",
    target: "tool-1",
    animated: true,
    label: "(1) Uses",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.8 },
    labelStyle: { fill: "#333333", fontWeight: 500 },
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#3b82f6",
    }
  },
  // Step 2: Agent initiates specific executions
  {
    id: "edge-agent-to-execution-1",
    source: "agent-1",
    target: "execution-1",
    animated: true,
    label: "(2) Initiates",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.8 },
    labelStyle: { fill: "#333333", fontWeight: 500 },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#8b5cf6",
    }
  },
  {
    id: "edge-agent-to-execution-2",
    source: "agent-1",
    target: "execution-2",
    animated: true,
    label: "(2) Initiates",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.8 },
    labelStyle: { fill: "#333333", fontWeight: 500 },
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#8b5cf6",
    }
  },
  // Step 3: Tool helps with executions
  {
    id: "edge-tool-to-execution-1",
    source: "tool-1",
    target: "execution-1",
    animated: true,
    label: "(3) Helps with",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.8 },
    labelStyle: { fill: "#333333", fontWeight: 500 },
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#10b981",
    }
  },
  {
    id: "edge-tool-to-execution-2",
    source: "tool-1",
    target: "execution-2",
    animated: true,
    label: "(3) Helps with",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.8 },
    labelStyle: { fill: "#333333", fontWeight: 500 },
    style: { stroke: "#10b981", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#10b981",
    }
  },
  // Step 4: Execution results flow back to the agent
  {
    id: "edge-execution-1-to-agent",
    source: "execution-1",
    target: "agent-1",
    animated: true,
    label: "(4) Returns result",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.8 },
    labelStyle: { fill: "#333333", fontWeight: 500 },
    type: 'smoothstep',
    style: { stroke: "#f97316", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#f97316",
    }
  },
  {
    id: "edge-execution-2-to-agent",
    source: "execution-2",
    target: "agent-1",
    animated: true,
    label: "(4) Returns result",
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.8 },
    labelStyle: { fill: "#333333", fontWeight: 500 },
    type: 'smoothstep',
    style: { stroke: "#f97316", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#f97316",
    }
  }
];

const nodeTypes: NodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  execution: ExecutionNode,
};

const AgentWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
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
