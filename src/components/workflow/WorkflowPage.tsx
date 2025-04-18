import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AgentWorkflow from "./AgentWorkflow";

const WorkflowPage = () => {
  return (
    <div className="container mx-auto py-6 px-4 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-6">Crew AI Agent Workflow Visualizer</h1>
      
      <div className="grid grid-cols-1 h-[calc(100vh-120px)]">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Agent Workflow</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <AgentWorkflow />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowPage;
