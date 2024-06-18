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
    <Box sx={{ width: '12vw', height: '100%', p: 2, borderRight: '1px solid #e0e0e0' }}>
      <SidebarItem type="argumentInputNode" label="Argument Input Node" />
      <SidebarItem type="anotherNodeType" label="Another Node Type" />
    </Box>
  );
};

export default Sidebar;
