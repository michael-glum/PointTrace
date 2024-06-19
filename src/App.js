import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './components/Header';
import Workspace from './components/Workspace';
import { Box } from '@mui/material';
import './App.css';
import 'reactflow/dist/style.css';

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Workspace />
        </Box>
      </Box>
    </DndProvider>
  );
};

export default App;
