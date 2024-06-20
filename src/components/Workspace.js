import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, useNodesState, useEdgesState, MiniMap, Controls, Background, ReactFlowProvider } from 'reactflow';
import { useDrop } from 'react-dnd';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { ItemTypes, NodeTypes } from '../utils/constants';
import { getNodeSize, getNodeId } from '../utils/nodeHelpers';

const initialNodes = [];
const initialEdges = [];

const Workspace = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    //const { isOver, drop } = useNodeDrop({ setNodes, reactFlowInstance, handleSubmit });

    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.NODE,
      drop: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (clientOffset && reactFlowInstance) {
          const {x, y} = clientOffset;
          const canvasPoint = reactFlowInstance.screenToFlowPosition({x, y});

          const { width, height } = getNodeSize(item.type);

          const newNode = {
            id: getNodeId(),
            type: item.type,
            position: {
            x: canvasPoint.x - width / 2,
            y: canvasPoint.y - height / 2
          },
            data: { text: item.text, onSubmit: handleSubmit },
          };
          setNodes((nds) => nds.concat(newNode));
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }), [setNodes, reactFlowInstance]);

    const handleSubmit = (text) => {
      console.log('Submitted argument:', text);
      // Add logic for handling the argument submission
    };

    return (
      <ReactFlowProvider>
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
              nodeTypes={NodeTypes}
              onInit={setReactFlowInstance}
              style={{ width: '100%', height: '100%' }}
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </Box>
      </Box>
      </ReactFlowProvider>
    );
  };
  
  export default Workspace;