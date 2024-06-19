import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';

const CenteredBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
});

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 'none',
        backgroundColor: '#242526',
        borderBottom: '1px solid #e0e0e0',
        color: 'white'
      }}>
      <Toolbar>
        <CenteredBox sx={{ transform: 'translateX(-32px)' /* Translate left by icon width and margin */ }}>
          <BubbleChartIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div">
            PointTrace
          </Typography>
        </CenteredBox>
      </Toolbar>
    </AppBar>
  );
};

export default Header;