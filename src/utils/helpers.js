import { v4 as uuidv4 } from 'uuid';
import { NodeSizeMap } from './constants';

export const getNodeSize = (type) => NodeSizeMap[type].normal || { width: 400, height: 300 };

export const getNodeId = () => `node_${uuidv4()}`;

export const getEdgeId = () => `edge_${uuidv4()}`;