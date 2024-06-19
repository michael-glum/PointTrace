import React, { useCallback } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, MiniMap, Controls, Background, useReactFlow } from 'reactflow';
import { useDrop } from 'react-dnd';
import Sidebar from './Sidebar';
import ArgumentInputNode from './ArgumentInputNode';
import { Box } from '@mui/material';
import { ItemTypes } from '../utils/constants';

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
  argumentInputNode: ArgumentInputNode,
};

const nodeSizeMap = {
  ArgumentInputNode: { width: 600, height: 300 },
};

const getNodeSize = (type) => nodeSizeMap[type] || { width: 150, height: 100 };

const Workspace = () => {
    const { screenToFlowPosition } = useReactFlow();
    const [nodes, setNodes] = React.useState(initialNodes);
    const [edges, setEdges] = React.useState(initialEdges);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.NODE,
      drop: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();

        const {width, height} = getNodeSize(item.type);

        if (clientOffset) {
          const {x, y} = clientOffset;

          const canvasPoint = screenToFlowPosition({ x, y });

          const newNode = {
            id: `node-${new Date().getTime()}`, // Generate a unique ID
            type: item.type,
            position: {
              x: canvasPoint.x - width / 2,
              y: canvasPoint.y - height / 2
            }, // Center the node on the cursor
            data: { text: item.text, onSubmit: handleSubmit },
          };
          setNodes((nds) => nds.concat(newNode));
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    const handleSubmit = (text) => {
      console.log('Submitted argument:', text);
      // Add logic for handling the argument submission
    };

    return (
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Box
          ref={drop}
          sx={{
            flex: 1,
            bgcolor: '#F5F5F5',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            style={{ width: '100%', height: '100%' }}
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </Box>
      </Box>
    );
  };
  
  export default Workspace;