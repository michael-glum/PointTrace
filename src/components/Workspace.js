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
          type: item.type,
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