import { v4 as uuidv4 } from 'uuid';
import { NodeSizeMap, NODE_MAX_WIDTH, NODE_SPACING, LAYER_SPACING } from './constants';

export const getNodeSize = (type) => NodeSizeMap[type].normal || { width: 400, height: 300 };

export const getNodeId = () => `node_${uuidv4()}`;

export const getEdgeId = () => `edge_${uuidv4()}`;

export const calculateSubtreeWidth = (subtree) => {
    if (!subtree || subtree.length === 0) return 0;
    const childWidths = subtree.map(node => calculateSubtreeWidth(node.children));
    const maxChildWidth = Math.max(...childWidths, 0);
    return Math.max(subtree.length * NODE_MAX_WIDTH + (subtree.length - 1) * NODE_SPACING, maxChildWidth);
};

export const positionNodesInSubtree = (subtree, startX, y) => {
    const subtreeWidth = calculateSubtreeWidth(subtree);
    let currentX = startX + (subtreeWidth - (subtree.length * NODE_MAX_WIDTH + (subtree.length - 1) * NODE_SPACING)) / 2;

    subtree.forEach(node => {
      node.position = { x: currentX, y };
      if (node.children && node.children.length > 0) {
        positionNodesInSubtree(node.children, currentX - (calculateSubtreeWidth(node.children) - NODE_MAX_WIDTH) / 2, y + LAYER_SPACING);
      }
      currentX += NODE_MAX_WIDTH + NODE_SPACING;
    });
};