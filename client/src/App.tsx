import React, { useCallback } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import NodeTypes from 'reactflow';
import "reactflow/dist/style.css";

import CustomNode from "./components/CustomNode";
import Nav from "./components/Nav";
import useFlowStore from "./store/flowStore";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore();


  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="flex h-screen">
      <Nav/>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          fitView
          panOnDrag
        >
          <Background color="#000" gap={20} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>

      </div>
    </div>
  );
}

export default App;
