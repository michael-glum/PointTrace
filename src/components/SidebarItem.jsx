import React from 'react';
import { useDrag } from 'react-dnd';
import { Box } from '@mui/material';
import { ItemTypes, NodeSizeMap } from '../utils/constants';

const SidebarItem = ({ type, label, NodeComponent }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.NODE,
      item: { type },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
  
    const normalSize = NodeSizeMap[type].normal;
    const previewSize = NodeSizeMap[type].preview;
    const scaleFactor = Math.min(previewSize.width / normalSize.width, previewSize.height / normalSize.height);
  
    const containerStyle = {
      width: normalSize.width,
      height: normalSize.height,
      transform: `scale(${scaleFactor})`,
      transformOrigin: 'top left',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    };
  
    return (
      <Box ref={drag} sx={{ cursor: 'move', overflow: 'hidden', width: previewSize.width, height: previewSize.height }}>
        <Box sx={{ opacity: isDragging ? 0.5 : 1, pointerEvents: 'none', ...containerStyle }}>
          <NodeComponent />
        </Box>
      </Box>
    );
  };

  export default SidebarItem;