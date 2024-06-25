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
    console.log("here-1");
    const nodeState = state.argument.nodes[nodeId];
    console.log("here-2");
    console.log("nodeId", nodeState);
    const conversationHistory = nodeState ? nodeState.conversationHistory : [];
    console.log("here-3")

    dispatch(setLoading({ nodeId, loading: true}));
    dispatch(setError(''));

    try {
      const newMessage = { role: 'user', content: makeInputPrompt(input) };
      console.log("here");
      const updatedHistory = [...conversationHistory, newMessage];
      console.log("here1");
      const gptResponse = await fetchGPTResponse(updatedHistory);
      console.log("here2");
      const responseContent = gptResponse.choices[0]?.message?.content || 'No response received.';
      console.log("responseContent", responseContent);

      const parsedArguments = parseArgumentResponse(responseContent);
      
      const updatedHistoryWithResponse = [...updatedHistory, { role: 'system', content: responseContent }];

      console.log("here3");

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
        });

        // Connect premises to conclusion
        premiseNodes.forEach(premiseNode => {
          allEdges.push({
            id: getEdgeId(),
            source: conclusionNodeId,
            target: premiseNode.id,
          });
        });

        assumptionNodes.forEach(assumptionNode => {
          const premiseNodeId = premiseNodes[assumptionNode.data.premiseIndex].id;
          allEdges.push({
            id: getEdgeId(),
            source: premiseNodeId,
            target: assumptionNode.id,
          });
        });
      });

      allNodes.forEach(node => dispatch(addNode(node)));
      allEdges.forEach(edge => dispatch(addEdge(edge)));

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