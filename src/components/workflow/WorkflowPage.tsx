
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-green-600 font-medium">Completed</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Verbose Mode</h3>
                  <p>Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Agent Flow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] px-4">
                <div className="relative pl-6 py-2">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-blue-200 ml-2.5"></div>
                  
                  {/* Step 1: Agent Starts */}
                  <div className="relative mb-4">
                    <div className="absolute -left-[10px] top-2 w-5 h-5 rounded-full bg-blue-500"></div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h3 className="text-sm font-bold text-blue-800">Agent Started</h3>
                      <p className="text-xs text-gray-700 mt-1">
                        LiteAgent Session Started
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Research Analyst</p>
                    </div>
                  </div>
                  
                  {/* Step 2: Agent Thinks */}
                  <div className="relative mb-4">
                    <div className="absolute -left-[10px] top-2 w-5 h-5 rounded-full bg-indigo-500"></div>
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                      <h3 className="text-sm font-bold text-indigo-800">Thinking</h3>
                      <p className="text-xs text-gray-700 mt-1">
                        I should search for the capital of France.
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 3: Using Tool */}
                  <div className="relative mb-4">
                    <div className="absolute -left-[10px] top-2 w-5 h-5 rounded-full bg-green-500"></div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <h3 className="text-sm font-bold text-green-800">Using Tool</h3>
                      <p className="text-xs text-gray-700 mt-1">Search the internet with Serper</p>
                      <p className="text-xs bg-gray-100 p-1 rounded mt-1 font-mono">
                        {'{\"search_query\": \"capital of France\"}'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 4: Tool Output */}
                  <div className="relative mb-4">
                    <div className="absolute -left-[10px] top-2 w-5 h-5 rounded-full bg-green-700"></div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <h3 className="text-sm font-bold text-green-800">Tool Output</h3>
                      <div className="text-xs bg-gray-50 p-2 rounded mt-1 max-h-20 overflow-auto">
                        <p className="font-medium">Paris is the capital and largest city of France...</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 5: Agent Thinks Again */}
                  <div className="relative mb-4">
                    <div className="absolute -left-[10px] top-2 w-5 h-5 rounded-full bg-indigo-500"></div>
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                      <h3 className="text-sm font-bold text-indigo-800">Thinking</h3>
                      <p className="text-xs text-gray-700 mt-1">
                        Processing search results...
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 6: Final Answer */}
                  <div className="relative mb-4">
                    <div className="absolute -left-[10px] top-2 w-5 h-5 rounded-full bg-purple-500"></div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h3 className="text-sm font-bold text-purple-800">Final Answer</h3>
                      <p className="text-xs text-gray-700 mt-1">
                        The capital of France is Paris.
                      </p>
                    </div>
                  </div>
                  
                  {/* Step 7: Agent Completed */}
                  <div className="relative mb-4">
                    <div className="absolute -left-[10px] top-2 w-5 h-5 rounded-full bg-emerald-500"></div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h3 className="text-sm font-bold text-emerald-800">Agent Completed</h3>
                      <p className="text-xs text-gray-700 mt-1">
                        LiteAgent Completed
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Research Analyst</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-3">
                <h3 className="font-medium text-green-800">SerperDevTool</h3>
                <p className="text-sm text-gray-600">Search the internet with Serper</p>
                <p className="text-xs text-gray-500 mt-1">Used for: Web search and information retrieval</p>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                <h3 className="font-medium text-purple-800">Last Execution</h3>
                <p className="text-sm text-gray-600">Search: capital of France</p>
                <p className="text-xs font-medium text-green-600 mt-1">Result: The capital of France is Paris.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
