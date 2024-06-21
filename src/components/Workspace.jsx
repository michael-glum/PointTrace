import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges, MiniMap, Controls, Background, ReactFlowProvider } from 'reactflow';
import useNodeDrop from '../hooks/useNodeDrop';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { NodeTypes } from '../utils/constants';
import { updateNode } from '../slices/nodeSlice';
import { addEdge as addEdgeAction } from '../slices/edgeSlice';

const Workspace = () => {
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.nodes);
  const edges = useSelector(state => state.edges);


  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => dispatch(updateNode(applyNodeChanges(changes, nodes))),
    [nodes, dispatch]
  );

  const onEdgesChange = useCallback(
    (changes) => dispatch(addEdgeAction(applyEdgeChanges(changes, edges))),
    [edges, dispatch]
  );

  const onConnect = useCallback(
    (params) => dispatch(addEdgeAction(addEdge(params, edges))),
    [edges, dispatch]
  );
    
  const { isOver, drop } = useNodeDrop(reactFlowInstance);

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