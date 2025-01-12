import React, { useState } from 'react';
import { Handle } from 'reactflow';
import Position from 'reactflow';
import { Pencil, Save, X } from 'lucide-react'; // Icons for better UI
import useFlowStore from '../store/flowStore';

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    type: 'email' | 'delay' | 'source';
    config?: {
      email?: string;
      subject?: string;
      body?: string;
      delay?: number;
    };
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="px-5 py-4 shadow-md rounded-lg bg-white border border-gray-300">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-white border-2 rounded-full"
      />

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">{data.label}</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-500 hover:text-blue-500"
        >
          {isEditing ? <X size={16} /> : <Pencil size={16} />}
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-4">
          {data.type === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={data.config?.email || ''}
                  onChange={(e) =>
                    updateNodeData(id, { config: { ...data.config, email: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={data.config?.subject || ''}
                  onChange={(e) =>
                    updateNodeData(id, { config: { ...data.config, subject: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Body
                </label>
                <textarea
                  placeholder="Enter email body"
                  value={data.config?.body || ''}
                  onChange={(e) =>
                    updateNodeData(id, { config: { ...data.config, body: e.target.value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
          )}
          {data.type === 'delay' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Delay (in minutes)
              </label>
              <input
                type="number"
                placeholder="Enter delay"
                value={data.config?.delay || ''}
                onChange={(e) =>
                  updateNodeData(id, { config: { ...data.config, delay: Number(e.target.value) } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
          )}
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <Save size={16} className="inline-block mr-1" />
              Save
            </button>
          </div>
        </form>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-white border-2 rounded-full"
      />
    </div>
  );
};

export default CustomNode;
