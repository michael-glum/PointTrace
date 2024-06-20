import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, useNodesState, useEdgesState, MiniMap, Controls, Background, ReactFlowProvider } from 'reactflow';
import useNodeDrop from '../hooks/useNodeDrop';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { NodeTypes, InitialInstructions } from '../utils/constants';

const initialNodes = [];
const initialEdges = [];

const Workspace = () => {
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    const [conversationHistory, setConversationHistory] = useState([
      { role: 'system', content: InitialInstructions }
    ]);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const handleSubmit = useCallback((action, params) => {
      const data = {
        id: params.id,
        input: params.input,
        nodes: params.nodes ? nodes : undefined,
        edges: params.edges ? edges : undefined,
        conversationHistory: params.conversationHistory ? conversationHistory : undefined,
        setNodes: params.setNodes ? setNodes: undefined,
        setEdges: params.setEdges ? setEdges : undefined,
        setConversationHistory: params.setConversationHistory ? setConversationHistory: undefined,
      };
      action(data);
    }, [nodes, edges, conversationHistory, setNodes, setEdges, setConversationHistory]);

    const {isOver, drop} = useNodeDrop({ setNodes, reactFlowInstance, handleSubmit });

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