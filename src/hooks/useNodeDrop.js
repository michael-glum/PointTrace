import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from '../utils/constants';
import { getNodeSize, getNodeId } from '../utils/helpers';
import { addNode } from '../slices/nodeSlice';
import { InitialInstructions } from '../utils/promptUtils';
import { setConversationHistory } from '../slices/argumentSlice';


const useNodeDrop = (reactFlowInstance) => {
  const dispatch = useDispatch();

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
          data: { nodeId: id, text: item.text },
        };
        
        dispatch(addNode(newNode));
        dispatch(setConversationHistory({ nodeId: id, conversationHistory: [{ role: 'system', content: InitialInstructions }] }));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [dispatch, reactFlowInstance]);

  return { isOver, drop };
};

export default useNodeDrop;