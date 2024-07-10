import dagre from 'dagre';
import { NODE_MAX_HEIGHT, NODE_MAX_WIDTH } from './constants';

const nodeWidth = NODE_MAX_WIDTH;
const nodeHeight = NODE_MAX_HEIGHT;

const getLayoutedElements = (nodes, edges, argumentInputNode, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  // Add nodes to the graph with their dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.width || nodeWidth, height: node.height || nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Perform the layout calculation
  dagre.layout(dagreGraph);

  // Determine the height of the argument input node
  const argumentNodeHeight = argumentInputNode.height || nodeHeight;

  // Adjust the positions of the nodes based on the argument input node
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - (node.width || nodeWidth) / 2 + argumentInputNode.position.x,
        y: nodeWithPosition.y - (node.height || nodeHeight) / 2 + argumentInputNode.position.y + argumentNodeHeight + 20, // Additional spacing below input node
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default getLayoutedElements;
