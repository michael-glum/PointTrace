import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGPTResponse } from '../services/openai';
import { makeInputPrompt } from '../utils/promptUtils';
import { addNode } from './nodeSlice';
import { addEdge } from './edgeSlice';
import { getNodeId, getEdgeId } from '../utils/helpers';
import { parseArgumentResponse } from '../utils/parseResponse';

export const initiateArgument = createAsyncThunk(
  'argument/initiateArgument',
  async ({ input, nodeId }, { dispatch, getState }) => {
    console.log("initiateArgument");
    const state = getState();
    const nodeState = state.argument.nodes[nodeId];
    console.log("nodeState", nodeState);
    const conversationHistory = nodeState ? nodeState.conversationHistory : [];

    dispatch(setLoading({ nodeId, loading: true}));
    dispatch(setError(''));

    try {
      const newMessage = { role: 'user', content: makeInputPrompt(input) };
      const updatedHistory = [...conversationHistory, newMessage];
      const gptResponse = await fetchGPTResponse(updatedHistory);
      const responseContent = gptResponse.choices[0]?.message?.content || 'No response received.';
      console.log("responseContent", responseContent);

      const parsedArguments = parseArgumentResponse(responseContent);
      console.log("parsedArguments", parsedArguments);
      
      const updatedHistoryWithResponse = [...updatedHistory, { role: 'system', content: responseContent }];

      const allNodes = [];
      const allEdges = [];

      parsedArguments.forEach((arg, argIndex) => {
        const argOffset = argIndex * 300;

        const conclusionNodeId = getNodeId();
        const conclusionNode = {
          id: conclusionNodeId,
          type: 'conclusion',
          position: { x: 0 + argOffset, y: 0 }, // Stagger arguments horizontally
          data: { label: arg.conclusion },
        };

        const premiseNodes = arg.premises.map((premise, index) => ({
          id: getNodeId(),
          type: 'premise',
          position: { x: -200 + argOffset, y: 100 * (index + 1) },
          data: { label: premise },
        }));

        const assumptionNodes = arg.explicitAssumptions.concat(arg.implicitAssumptions).map((assumption, index) => ({
          id: getNodeId(),
          type: 'assumption',
          position: { x: 200 + argOffset, y: 100 * (index + 1) },
          data: { label: assumption.text, premiseIndex: assumption.premiseIndex },
        }));

        allNodes.push(conclusionNode, ...premiseNodes, ...assumptionNodes);

        // Connect conclusion to argument input node
        allEdges.push({
          id: getEdgeId(),
          source: nodeId,
          target: conclusionNodeId,
          targetHandle: 'target-handle-top',
        });

        // Connect premises to conclusion
        premiseNodes.forEach(premiseNode => {
          allEdges.push({
            id: getEdgeId(),
            source: premiseNode.id,
            target: conclusionNodeId,
            sourceHandle: 'source-handle-top',
            targetHandle: 'target-handle-bottom',
          });
        });

        assumptionNodes.forEach(assumptionNode => {
          const premiseNodeId = premiseNodes[assumptionNode.data.premiseIndex]?.id;
          if (premiseNodeId) {
            allEdges.push({
              id: getEdgeId(),
              source: premiseNodeId,
              target: assumptionNode.id,
              sourceHandle: 'source-handle-bottom',
              targetHandle: 'target-handle-top',
            });
          }
        });
      });

      console.log("allNodes", allNodes);
      console.log("allEdges", allEdges);

      allNodes.forEach(node => dispatch(addNode(node)));
      setTimeout(() => { // Adding a slight delay to ensure nodes are created before edges
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