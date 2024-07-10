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
  
// TODO: Consolidate node sizing into one map
export const NodeSizeMap = {
    argumentInputNode: { normal: { width: 400, height: 300 }, preview: { width: 150, height: 112.5 } },
};

export const NODE_MIN_WIDTH = 150;
export const NODE_MAX_WIDTH = 300;
export const NODE_MIN_HEIGHT = 50;
export const NODE_MAX_HEIGHT = 100;
export const NODE_SPACING = 50;
export const LAYER_SPACING = NODE_MAX_HEIGHT + 50; // Ensure vertical spacing is more than the max height of a node