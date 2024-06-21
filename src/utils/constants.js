import ArgumentInputNode from '../components/ArgumentInputNode'
import { ConclusionNode, PremiseNode, AssumptionNode } from '../components/ArgumentNodes';

export const ItemTypes = {
    NODE: 'node',
};

export const NodeTypes = {
    argumentInputNode: ArgumentInputNode,
    conclusion: ConclusionNode,
    premise: PremiseNode,
    assumption: AssumptionNode,
  };
  
export const NodeSizeMap = {
    argumentInputNode: { normal: { width: 400, height: 300 }, preview: { width: 150, height: 112.5 } },
};