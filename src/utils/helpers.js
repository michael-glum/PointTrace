import { v4 as uuidv4 } from 'uuid';
import { NodeSizeMap } from './constants';

export const getNodeSize = (type) => NodeSizeMap[type].normal || { width: 400, height: 300 };

export const getNodeId = () => `node_${uuidv4()}`;

export const getEdgeId = () => `edge_${uuidv4()}`;

export const calculateSubtreeWidth = (nodes, nodeWidth, nodeSpacing) => {
    if (!nodes || nodes.length === 0) return 0;

    let maxWidth = 0;
    nodes.forEach(node => {
        const childWidth = calculateSubtreeWidth(node.children || [], nodeWidth, nodeSpacing);
        const currentWidth = Math.max(nodeWidth, childWidth);
        maxWidth += currentWidth + nodeSpacing;
    });

    return maxWidth - nodeSpacing; // Subtracting extra spacing added in last loop
};

export const calculateTotalTreeWidth = (subtreeWidths, nodeSpacing) => {
    return subtreeWidths.reduce((acc, width) => acc + width, 0) + (subtreeWidths.length - 1) * nodeSpacing;
};

export const positionNodesHorizontally = (totalWidth, nodeWidth, nodeSpacing, index) => {
    const halfTotalWidth = totalWidth / 2;
    const positionX = index * (nodeWidth + nodeSpacing) - halfTotalWidth + (nodeWidth + nodeSpacing) / 2;
    return positionX;
}