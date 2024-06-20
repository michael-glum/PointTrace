export const initiateArgument = (data) => {
    console.log("nodeId", data.id);
    console.log("inputValue", data.input);
    console.log("conversationHistory", data.conversationHistory);
}

export const initiateArgumentParams = {
    id: true,
    input: true,
    nodes: true,
    edges: true,
    conversationHistory: true,
    setNodes: true,
    setEdges: true,
    setConversationHistory: true,
}