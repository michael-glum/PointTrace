import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGPTResponse } from '../services/openai';
import { makeInputPrompt } from '../utils/promptUtils';
import { addNode } from './nodeSlice';
import { addEdge } from './edgeSlice';
import { getNodeId, getEdgeId, calculateSubtreeWidth, calculateTotalTreeWidth, positionNodesHorizontally } from '../utils/helpers';
import { parseArgumentResponse } from '../utils/parseResponse';
import { NODE_MAX_WIDTH, NODE_MAX_HEIGHT, NODE_SPACING, LAYER_SPACING } from '../utils/constants';

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

      // Convert arguments to a nested structure
      const convertToNestedStructure = (arg) => {
        const premises = arg.premises.map((premise, premiseIndex) => ({
          label: premise,
          type: 'premise',
          premiseIndex,
          children: arg.explicitAssumptions.concat(arg.implicitAssumptions)
            .filter(assumption => assumption.premiseIndex === premiseIndex)
            .map(assumption => ({
              label: assumption.text,
              type: 'assumption',
              children: [] // Add future layers here
            }))
        }));

        return {
          label: arg.conclusion,
          type: 'conclusion',
          children: premises
        };
      };

      // Calculate the width of each argument subtree
      const subtreeWidths = parsedArguments.map(arg => {
        const nestedArg = convertToNestedStructure(arg);
        return calculateSubtreeWidth([nestedArg], NODE_MAX_WIDTH, NODE_SPACING);
      });

      // Calculate the total width of the entire tree
      const totalTreeWidth = calculateTotalTreeWidth(subtreeWidths, NODE_SPACING);

      // Calculate the horizontal position for each argument subtree
      parsedArguments.forEach((arg, argIndex) => {
        const argOffset = positionNodesHorizontally(totalTreeWidth, NODE_MAX_WIDTH, NODE_SPACING, argIndex);
        const argX = argumentInputNodePosition.x + argOffset;
        const argY = argumentInputNodePosition.y + LAYER_SPACING;
      
        const conclusionNodeId = getNodeId();
        const conclusionNode = {
          id: conclusionNodeId,
          type: 'conclusion',
          position: { x: argX, y: argY },
          data: { label: arg.conclusion },
        };

        const nestedArg = convertToNestedStructure(arg);
        const totalPremiseWidth = calculateSubtreeWidth(nestedArg.children, NODE_MAX_WIDTH, NODE_SPACING);

        const premiseNodes = nestedArg.children.map((premise, index) => {
          const premiseOffset = positionNodesHorizontally(totalPremiseWidth, NODE_MAX_WIDTH, NODE_SPACING, index);
          const premiseX = argX + premiseOffset - totalPremiseWidth / 2;
          const premiseY = argY + NODE_MAX_HEIGHT + LAYER_SPACING;
          return {
            id: getNodeId(),
            type: 'premise',
            position: { x: premiseX, y: premiseY },
            data: { label: premise.label }
          };
        });

        const assumptionNodes = nestedArg.children.flatMap(premise => 
          premise.children.map((assumption, index) => {
            const assumptionOffset = positionNodesHorizontally(totalPremiseWidth, NODE_MAX_WIDTH, NODE_SPACING, index);
            const assumptionX = argX + assumptionOffset - totalPremiseWidth / 2;
            const assumptionY = premiseNodes[0].position.y + NODE_MAX_HEIGHT + LAYER_SPACING;
            return {
              id: getNodeId(),
              type: 'assumption',
              position: { x: assumptionX, y: assumptionY },
              data: { label: assumption.label, premiseIndex: premise.premiseIndex }
            };
          })
        );

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

        // Connect assumptions to their respective premises
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

      // Dispatching nodes and edges
      const dispatchNodesAndEdges = () => {
        allNodes.forEach(node => dispatch(addNode(node)));
        setTimeout(() => { // Adding a slight delay to ensure nodes are created before edges
          allEdges.forEach(edge => dispatch(addEdge(edge)));
        }, 100);
      };

      dispatchNodesAndEdges();
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