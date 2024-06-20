import ArgumentInputNode from '../components/ArgumentInputNode'

export const ItemTypes = {
    NODE: 'node',
};

export const NodeTypes = {
    argumentInputNode: ArgumentInputNode,
  };
  
export const NodeSizeMap = {
    argumentInputNode: { normal: { width: 400, height: 300 }, preview: { width: 150, height: 112.5 } },
};

export const InitialInstructions = 'You are an assistant that analyzes arguments and breaks them down into Conclusion, Premises, and Assumptions. Additionally, evaluate the validity of the argument.';