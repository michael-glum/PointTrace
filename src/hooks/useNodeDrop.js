import { useDrop } from 'react-dnd';
import { ItemTypes } from '../utils/constants';
import { getNodeSize, getNodeId } from '../utils/helpers';

const useNodeDrop = ({ setNodes, reactFlowInstance, handleSubmit }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.NODE,
    drop: (item, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset && reactFlowInstance) {
        const { x, y } = clientOffset;
        const canvasPoint = reactFlowInstance.screenToFlowPosition({ x, y });

        const { width, height } = getNodeSize(item.type);
        const id = getNodeId();

        const newNode = {
          id,
          type: item.type,
          position: {
            x: canvasPoint.x - width / 2,
            y: canvasPoint.y - height / 2,
          },
          data: { id, text: item.text, onSubmit: handleSubmit },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [setNodes, reactFlowInstance]);

  return { isOver, drop };
};

export default useNodeDrop;
