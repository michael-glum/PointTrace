import React from 'react';
import { Box, Typography } from '@mui/material';
import SidebarItem from './SidebarItem';
import ArgumentInputNode from './ArgumentInputNode';

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
