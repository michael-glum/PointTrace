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
      <Box sx={{ height: '96.5vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ height: '100vh', display: 'flex', width: '99vw' }}>
          <Workspace />
        </Box>
      </Box>
    </DndProvider>
  );
};

export default App;
