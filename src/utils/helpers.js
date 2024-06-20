import { NodeSizeMap } from './constants';

export const getNodeSize = (type) => NodeSizeMap[type].normal || { width: 400, height: 300 };

export const getNodeId = () => `node_${new Date().getTime()}`;