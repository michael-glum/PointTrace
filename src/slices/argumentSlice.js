import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGPTResponse } from '../services/openai';
import { makeInputPrompt } from '../utils/promptUtils';
import { addNode } from './nodeSlice';
import { addEdge } from './edgeSlice';
import { getNodeId, getEdgeId } from '../utils/helpers';
import { InitialInstructions } from '../utils/promptUtils';
import { parseArgumentResponse } from '../utils/parseResponse';

export const initiateArgument = createAsyncThunk(
  'argument/initiateArgument',
  async (input, { dispatch, getState }) => {
    const state = getState();
    const conversationHistory = state.argument.conversationHistory;

    dispatch(setLoading(true));
    dispatch(setError(''));

    try {
      const newMessage = { role: 'user', content: makeInputPrompt(input) };
      const updatedHistory = [...conversationHistory, newMessage];

      const gptResponse = await fetchGPTResponse(updatedHistory);
      const responseContent = gptResponse.choices[0]?.message?.content || 'No response received.';

      const parsedResponse = parseArgumentResponse(responseContent);
      
      const updatedHistoryWithResponse = [...updatedHistory, { role: 'system', content: responseContent }];

      const conclusionNode = {
        id: getNodeId(),
        type: 'conclusion',
        position: { x: 0, y: 0 },
        data: { label: parsedResponse.conclusion },
      };

      const premiseNodes = parsedResponse.premises.map((premise, index) => ({
        id: getNodeId(),
        type: 'premise',
        position: { x: -200, y: 100 * (index + 1) },
        data: { label: premise },
      }));

      const assumptionNodes = parsedResponse.assumptions.map((assumption, index) => ({
        id: getNodeId(),
        type: 'assumption',
        position: { x: 200, y: 100 * (index + 1) },
        data: { label: assumption },
      }));

      const allNodes = [conclusionNode, ...premiseNodes, ...assumptionNodes];

      const edges = [...premiseNodes, ...assumptionNodes].map(node => ({
        id: getEdgeId(),
        source: conclusionNode.id,
        target: node.id,
      }));

      allNodes.forEach(node => dispatch(addNode(node)));
      edges.forEach(edge => dispatch(addEdge(edge)));

      dispatch(setResponse(responseContent));
      dispatch(setConversationHistory(updatedHistoryWithResponse));

    } catch (error) {
      console.error("Error fetching GPT response:", error);
      dispatch(setError('An error occurred while fetching the response.'));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const argumentSlice = createSlice({
  name: 'argument',
  initialState: {
    conversationHistory: [{ role: 'system', content: InitialInstructions }],
    loading: false,
    error: '',
    response: '',
    submitted: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setResponse: (state, action) => {
      state.response = action.payload;
    },
    setConversationHistory: (state, action) => {
      state.conversationHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateArgument.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(initiateArgument.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateArgument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred while fetching the response.';
      });
  },
});

export const { setLoading, setError, setResponse, setConversationHistory } = argumentSlice.actions;
export default argumentSlice.reducer;
