import React, { useCallback } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, MiniMap, Controls, Background } from 'reactflow';
import { useDrop } from 'react-dnd';
import Sidebar from './Sidebar';
import ArgumentInputNode from './ArgumentInputNode';
import { Box } from '@mui/material';
import { ItemTypes } from '../utils/constants';

const initialNodes = [];
const initialEdges = [];

const Workspace = () => {
    const [nodes, setNodes] = React.useState(initialNodes);
    const [edges, setEdges] = React.useState(initialEdges);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.NODE,
      drop: (item, monitor) => {
        const { x, y } = monitor.getClientOffset();
        const newNode = {
          id: `node-${nodes.length + 1}`,
          type: 'argumentInputNode',
          position: { x, y },
          data: { text: item.text, onSubmit: handleSubmit },
        };
        setNodes((nds) => nds.concat(newNode));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    const handleSubmit = (text) => {
      console.log('Submitted argument:', text);
      // Add logic for handling the argument submission
    };

    const nodeTypes = {
      argumentInputNode: ArgumentInputNode,
      // Add more node types here
    };

    return (
      <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
        <Sidebar />
        <Box
          ref={drop}
          sx={{
            flex: 1,
            bgcolor: 'white',
            height: '100%',
            width: '100%',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            style={{ width: '100%', height: '100%' }} // Ensure React Flow container has width and height
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