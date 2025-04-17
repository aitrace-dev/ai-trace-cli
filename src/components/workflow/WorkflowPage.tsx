import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AgentWorkflow from "./AgentWorkflow";

const WorkflowPage = () => {
  return (
    <div className="container mx-auto py-6 px-4 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-6">Crew AI Agent Workflow Visualizer</h1>
      
      <div className="grid grid-cols-1">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Agent Workflow</CardTitle>
          </CardHeader>
          <CardContent className="h-[600px]">
            <AgentWorkflow />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowPage;
