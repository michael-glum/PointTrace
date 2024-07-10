import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
} from 'reactflow';
import { debounce } from 'lodash';
import useNodeDrop from '../hooks/useNodeDrop';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import { NodeTypes } from '../utils/constants';
import { setNodes as setNodesAction, updateNode as updateNodeAction } from '../slices/nodeSlice';
import { setEdges as setEdgesAction, addEdge as addEdgeAction } from '../slices/edgeSlice';

const Workspace = () => {
  const dispatch = useDispatch();
  const reduxNodes = useSelector((state) => state.nodes);
  const reduxEdges = useSelector((state) => state.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState(reduxNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reduxEdges);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { drop } = useNodeDrop(reactFlowInstance);

  // Sync Redux state to local state only once to avoid infinite loop
  useEffect(() => {
    setNodes(reduxNodes);
  }, [reduxNodes, setNodes]);

  useEffect(() => {
    setEdges(reduxEdges);
  }, [reduxEdges, setEdges]);

  // Debounced function to update Redux
  const debouncedUpdateNodes = useCallback(
    debounce((updatedNodes) => {
      dispatch(setNodesAction(updatedNodes));
    }, 500),
    [dispatch]
  );

  const debouncedUpdateEdges = useCallback(
    debounce((updatedEdges) => {
      dispatch(setEdgesAction(updatedEdges));
    }, 500),
    [dispatch]
  );

  // Use ReactFlow's built-in handlers for performance
  const onNodesChangeHandler = useCallback(
    (changes) => {
      setNodes((nds) => {
        if (!changes) {
          console.error('Node changes are undefined');
          return nds;
        }
        const updatedNodes = applyNodeChanges(changes, nds);
        debouncedUpdateNodes(updatedNodes);
        return updatedNodes;
      });
    },
    [onNodesChange, debouncedUpdateNodes]
  );

  const onEdgesChangeHandler = useCallback(
    (changes) => {
      setEdges((eds) => {
        if (!changes) {
          console.error('Edge changes are undefined');
          return eds;
        }
        const updatedEdges = applyEdgeChanges(changes, eds);
        debouncedUpdateEdges(updatedEdges);
        return updatedEdges;
      });
    },
    [onEdgesChange, debouncedUpdateEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const updatedEdges = addEdge(params, eds);
        dispatch(addEdgeAction(params));
        return updatedEdges;
      });
    },
    [setEdges, dispatch]
  );

  const getChildNodes = useCallback((nodeId) => {
    return edges
      .filter(edge => edge.source === nodeId)
      .map(edge => nodes.find(node => node.id === edge.target));
  }, [edges, nodes]);

  const updateNodeAndChildren = useCallback((nodeId, dx, dy, visited = new Set()) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    setNodes((prevNodes) => 
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          const newNode = {
            ...node,
            position: {
              x: node.position.x + dx,
              y: node.position.y + dy,
            },
          };
          return newNode;
        }
        return node;
      })
    );

    const childNodes = getChildNodes(nodeId);
    childNodes.forEach((childNode) => {
      if (childNode) {
        updateNodeAndChildren(childNode.id, dx, dy, visited);
      }
    });
  }, [getChildNodes]);

  const onNodeDragStop = useCallback(
    (event, node) => {
      const dx = node.position.x - node.positionAbsolute.x;
      const dy = node.position.y - node.positionAbsolute.y;
      updateNodeAndChildren(node.id, dx, dy);
      debouncedUpdateNodes(nodes); // Debounce the update to Redux here
    },
    [updateNodeAndChildren, debouncedUpdateNodes, nodes]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      dispatch(setNodesAction(flow.nodes));
      dispatch(setEdgesAction(flow.edges));
    }
  }, [reactFlowInstance, dispatch]);

  return (
    <ReactFlowProvider>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar onSave={onSave} />
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
            onNodesChange={onNodesChangeHandler}
            onEdgesChange={onEdgesChangeHandler}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
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
