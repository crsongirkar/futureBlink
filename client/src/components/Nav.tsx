import React from "react";
import useFlowStore from "../store/flowStore";
import Draggable from "react-draggable";

const Nav: React.FC = () => {
  const addNode = useFlowStore((state) => state.addNode);

  const nodeTypes = [
    { type: "email", label: "Send Email" },
    { type: "delay", label: "Waiting Time" },
    { type: "source", label: "Lead Source" },
  ] as const;
  const { saveFlow } = useFlowStore();

  return (
    <Draggable>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 100,
          position: "absolute",
        }}
      >
        {nodeTypes.map(({ type, label }) => (
          <div
            key={type}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => addNode(type)}
            onDragStart={(e) => {
              e.dataTransfer.setData("application/reactflow", type);
            }}
          >
            <span>{label}</span>
          </div>
        ))}
        <button
          onClick={saveFlow}
          className=" top-300 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-green-600 shadow-md"
        >
          Save Data
        </button>
      </div>
    </Draggable>
  );
};

export default Nav;
