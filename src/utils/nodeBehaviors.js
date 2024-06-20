import { useDrop } from 'react-dnd';
import { getNodeSize, getNodeId } from './nodeHelpers';
import { ItemTypes } from './constants';

export const useNodeDrop = ({ setNodes, reactFlowInstance, handleSubmit }) => useDrop(() => ({
    accept: ItemTypes.NODE,
    drop: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (clientOffset && reactFlowInstance) {
            const {x, y} = clientOffset;
            const canvasPoint = reactFlowInstance.screenToFlowPosition({x, y});
            const { width, height } = getNodeSize(item.type);
            const newNode = {
                id: getNodeId(),
                type: item.type,
                position: {
                x: canvasPoint.x - width / 2,
                y: canvasPoint.y - height / 2
            },
                data: { text: item.text, onSubmit: handleSubmit },
            };
            setNodes((nds) => nds.concat(newNode));
        }
    },
    collect: (monitor) => ({
        isOver: !!monitor.isOver(),
    }),
}), [setNodes, reactFlowInstance]);

