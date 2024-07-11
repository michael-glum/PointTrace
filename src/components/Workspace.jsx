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

  const initialNodePositions = useRef({});

  // Sync Redux state to local state only once to avoid infinite loop
  useEffect(() => {
    setNodes(reduxNodes);
  }, [reduxNodes, setNodes]);

  useEffect(() => {
    setEdges(reduxEdges);
  }, [reduxEdges, setEdges]);

  // Debounced functions to update Redux
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

  const getChildNodes = useCallback((nodeId) => {
    return edges
      .filter(edge => edge.source === nodeId)
      .map(edge => nodes.find(node => node.id === edge.target));
  }, [edges, nodes]);

  const updateNodeAndDescendants = useCallback((nodeId, dx, dy, visited = new Set()) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const childNodes = getChildNodes(nodeId);

    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((node) => {
        if (node.id === nodeId || childNodes.some((child) => child.id === node.id)) {
          return {
            ...node,
            position: {
              x: node.position.x + dx,
              y: node.position.y + dy,
            },
          };
        }
        return node;
      });

      childNodes.forEach((childNode) => {
        if (childNode) {
          updateNodeAndDescendants(childNode.id, dx, dy, visited);
        }
      });

      return updatedNodes;
    });
  }, [getChildNodes, setNodes]);

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
    [debouncedUpdateNodes, onNodesChange]
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
    [debouncedUpdateEdges, onEdgesChange]
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

  const onNodeDragStart = useCallback((_, node) => {
    const storeInitialPositions = (nodeId) => {
      const initialNode = nodes.find((n) => n.id === nodeId);
      if (initialNode) {
        initialNodePositions.current[nodeId] = { x: initialNode.position.x, y: initialNode.position.y };
        getChildNodes(nodeId).forEach((childNode) => {
          if (childNode) storeInitialPositions(childNode.id);
        });
      }
    };

    storeInitialPositions(node.id);
  }, [nodes, getChildNodes]);

  const onNodeDrag = useCallback((event, node) => {
    const initialPosition = initialNodePositions.current[node.id];
    const dx = node.position.x - initialPosition.x;
    const dy = node.position.y - initialPosition.y;

    const updateAllPositions = (nodeId, dx, dy) => {
      setNodes((nds) => {
        const updatedNodes = nds.map((n) => {
          const initialPos = initialNodePositions.current[n.id];
          if (initialPos) {
            return {
              ...n,
              position: {
                x: initialPos.x + dx,
                y: initialPos.y + dy,
              },
            };
          }
          return n;
        });
        return updatedNodes;
      });

      getChildNodes(nodeId).forEach((childNode) => {
        if (childNode) updateAllPositions(childNode.id, dx, dy);
      });
    };

    updateAllPositions(node.id, dx, dy);
  }, [getChildNodes, setNodes]);

  const onNodeDragStop = useCallback((event, node) => {
    initialNodePositions.current = {};
    debouncedUpdateNodes(nodes);
  }, [debouncedUpdateNodes, nodes]);

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
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
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
