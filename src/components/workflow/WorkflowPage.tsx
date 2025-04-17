
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AgentWorkflow from "./AgentWorkflow";

const WorkflowPage = () => {
  return (
    <div className="container mx-auto py-6 px-4 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-6">Crew AI Agent Workflow Visualizer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Agent Workflow</CardTitle>
            </CardHeader>
            <CardContent className="h-[600px]">
              <AgentWorkflow />
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Workflow Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-blue-500 mr-2"></div>
                  <span>Agent to Tool (Step 1)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-purple-500 mr-2"></div>
                  <span>Agent to Execution (Step 2)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-green-500 mr-2"></div>
                  <span>Tool to Execution (Step 3)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-orange-500 mr-2"></div>
                  <span>Data Flow Return (Step 4)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Agent Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="font-semibold">Research Analyst</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Goal</h3>
                  <p>Find and summarize information about specific topics</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Backstory</h3>
                  <p>You are an experienced researcher with attention to detail</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Verbose Mode</h3>
                  <p>Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-3">
                <h3 className="font-medium text-green-800">SerperDevTool</h3>
                <p className="text-sm text-gray-600">Web search and information retrieval tool</p>
              </div>
              
              <div className="text-sm text-gray-500 mt-4">
                <p>Tools enable agents to interact with external systems and data sources.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
