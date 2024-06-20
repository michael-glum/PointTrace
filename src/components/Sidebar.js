import React from 'react';
import { useDrag } from 'react-dnd';
import { Box, Typography } from '@mui/material';
import { ItemTypes } from '../utils/constants';
import ArgumentInputNode from './ArgumentInputNode';
import { NodeSizeMap } from '../utils/constants';

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

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 200,
        bgcolor: '#FFFFFF',
        height: '100%',
        p: 2,
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>Nodes</Typography>
      <Box
        sx={{
          borderTop: '1px solid #e0e0e0',
          p: 2,
          width: '100%',
          height: 'calc(100% - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <SidebarItem
          type="argumentInputNode"
          label="Argument Input"
          NodeComponent={ArgumentInputNode}
        />
      </Box>
    </Box>
  );
};

export default Sidebar;
