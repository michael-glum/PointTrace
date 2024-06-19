import React from 'react';
import { useDrag } from 'react-dnd';
import { Box, Typography } from '@mui/material';
import { ItemTypes } from '../utils/constants';

const SidebarItem = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NODE,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Box ref={drag} sx={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', p: 2, border: '1px solid #e0e0e0', mb: 2 }}>
      <Typography variant="body1">{label}</Typography>
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
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
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
        <SidebarItem type="argumentInputNode" label="Argument Input" />
        <SidebarItem type="anotherNodeType" label="Another Node" />
      </Box>
    </Box>
  );
};

export default Sidebar;
