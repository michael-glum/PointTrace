import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGPTResponse } from '../services/openai';
import { makeInputPrompt } from '../utils/promptUtils';
import { addNode } from './nodeSlice';
import { addEdge } from './edgeSlice';
import { getNodeId, getEdgeId, calculateSubtreeWidth, positionNodesInSubtree } from '../utils/helpers';
import { parseArgumentResponse } from '../utils/parseResponse';
import { LAYER_SPACING } from '../utils/constants';

export const initiateArgument = createAsyncThunk(
  'argument/initiateArgument',
  async ({ input, nodeId }, { dispatch, getState }) => {
    const state = getState();
    const nodeState = state.argument.nodes[nodeId];
    
    // Find the position of the argument input node
    const argumentInputNode = state.nodes.find(node => node.id === nodeId);
    const argumentInputNodePosition = argumentInputNode ? argumentInputNode.position : { x: 0, y: 0 };

    const conversationHistory = nodeState ? nodeState.conversationHistory : [];

    dispatch(setLoading({ nodeId, loading: true}));
    dispatch(setError(''));

    try {
      const updatedHistory = [...conversationHistory, { role: 'user', content: makeInputPrompt(input) }];
      const gptResponse = await fetchGPTResponse(updatedHistory);
      const responseContent = gptResponse.choices[0]?.message?.content || 'No response received.';
      const updatedHistoryWithResponse = [...updatedHistory, { role: 'system', content: responseContent }];
      console.log("responseContent", responseContent);

      const parsedArguments = parseArgumentResponse(responseContent);
      console.log("parsedArguments", parsedArguments);

      // Create tree structure
      const argumentTree = parsedArguments.map(arg => ({
        type: 'conclusion',
        data: { label: arg.conclusion },
        children: arg.premises.map((premise, premiseIndex) => ({
          type: 'premise',
          data: { label: premise },
          children: arg.explicitAssumptions.concat(arg.implicitAssumptions)
            .filter(assumption => assumption.premiseIndex === premiseIndex)
            .map(assumption => ({
              type: 'assumption',
              data: { label: assumption.text },
              children: []
            }))
        }))
      }));

      console.log("argumentTree", argumentTree);

      // Calculate the total width of the tree
      const totalWidth = calculateSubtreeWidth(argumentTree);
      console.log("totalWidth", totalWidth);

      // Position all nodes
      const startX = argumentInputNodePosition.x - totalWidth / 2;
      const startY = argumentInputNodePosition.y + LAYER_SPACING;
      positionNodesInSubtree(argumentTree, startX, startY);

      console.log("positioned argumentTree", argumentTree);

      // Flatten the tree structure and create nodes and edges
      const allNodes = [];
      const allEdges = [];

      const flattenTree = (node, parentId) => {
        const id = getNodeId();
        allNodes.push({
          id,
          type: node.type,
          position: node.position,
          data: node.data
        });

        if (parentId) {
          const edge = {
            id: getEdgeId(),
            source: parentId,
            target: id,
            sourceHandle: 'source-handle-bottom'
          };

          if (parentId !== nodeId) { // If the parent is not the ArgumentInputNode
            edge.targetHandle = 'target-handle-top';
          }

          allEdges.push(edge);
        }

        node.children.forEach(child => flattenTree(child, id));
      };

      // Flatten the tree and start from the argument input node
      argumentTree.forEach(node => flattenTree(node, nodeId));

      // Dispatch nodes first
      allNodes.forEach(node => dispatch(addNode(node)));

      // Delay to ensure nodes are rendered before dispatching edges
      setTimeout(() => {
        allEdges.forEach(edge => dispatch(addEdge(edge)));
      }, 100);

      dispatch(setResponse({ nodeId, response: responseContent }));
      dispatch(setConversationHistory({ nodeId, conversationHistory: updatedHistoryWithResponse }));

    } catch (error) {
      console.error("Error fetching GPT response:", error);
      dispatch(setError({ nodeId, error: 'An error occurred while fetching the response.' }));
    } finally {
      dispatch(setLoading({ nodeId, loading: false }));
    }
  }
);

const argumentSlice = createSlice({
  name: 'argument',
  initialState: {
    nodes: {},
  },
  reducers: {
    setLoading: (state, action) => {
      const { nodeId, loading } = action.payload;
      if (!state.nodes[nodeId]) state.nodes[nodeId] = {};
      state.nodes[nodeId].loading = loading;
    },
    setError: (state, action) => {
      const { nodeId, error } = action.payload;
      if (!state.nodes[nodeId]) state.nodes[nodeId] = {};
      state.nodes[nodeId].error = error;
    },
    setResponse: (state, action) => {
      const { nodeId, response } = action.payload;
      if (!state.nodes[nodeId]) state.nodes[nodeId] = {};
      state.nodes[nodeId].response = response;
    },
    setConversationHistory: (state, action) => {
      const { nodeId, conversationHistory } = action.payload;
      if (!state.nodes[nodeId]) state.nodes[nodeId] = {};
      state.nodes[nodeId].conversationHistory = conversationHistory;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(initiateArgument.pending, (state, action) => {
      const { nodeId } = action.meta.arg;
      if (!state.nodes[nodeId]) state.nodes[nodeId] = {};
      state.nodes[nodeId].loading = true;
      state.nodes[nodeId].error = '';
    })
    .addCase(initiateArgument.fulfilled, (state, action) => {
      const { nodeId } = action.meta.arg;
      if (!state.nodes[nodeId]) state.nodes[nodeId] = {};
      state.nodes[nodeId].loading = false;
    })
    .addCase(initiateArgument.rejected, (state, action) => {
      const { nodeId } = action.meta.arg;
      if (!state.nodes[nodeId]) state.nodes[nodeId] = {};
      state.nodes[nodeId].loading = false;
      state.nodes[nodeId].error = action.error.message || 'An error occurred while fetching the response.';
    });
  },
});

export const { setLoading, setError, setResponse, setConversationHistory } = argumentSlice.actions;
export default argumentSlice.reducer;