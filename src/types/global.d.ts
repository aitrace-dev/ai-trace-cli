interface Window {
  CREW_AI_WORKFLOW?: {
    nodes: Array<{
      id: string;
      type?: string;
      data: any;
      position: { x: number; y: number };
      [key: string]: any;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      markerEnd?: {
        type: string;
        [key: string]: any;
      };
      [key: string]: any;
    }>;
  };
}
