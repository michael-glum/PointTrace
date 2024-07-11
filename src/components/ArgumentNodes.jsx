import React, { useState } from 'react';
import { Handle } from 'reactflow';
import { Card, CardContent, Typography, Box, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NODE_MIN_WIDTH, NODE_MAX_WIDTH, NODE_MIN_HEIGHT, NODE_MAX_HEIGHT } from '../utils/constants';

const StyledCard = styled(Card)(({ theme, nodetype }) => ({
  minWidth: `${NODE_MIN_WIDTH}px`,
  maxWidth: `${NODE_MAX_WIDTH}px`,
  minHeight: `${NODE_MIN_HEIGHT}px`,
  maxHeight: `${NODE_MAX_HEIGHT}px`,
  overflow: 'hidden',
  padding: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  backgroundColor: (() => {
    switch (nodetype) {
      case 'conclusion':
        return theme.palette.primary.light;
      case 'premise':
        return theme.palette.secondary.light;
      case 'assumption':
        return theme.palette.warning.light;
      default:
        return theme.palette.background.paper;
    }
  })(),
}));

const NodeWrapper = ({ nodetype, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <StyledCard nodetype={nodetype} onClick={handleOpen}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            {nodetype.charAt(0).toUpperCase() + nodetype.slice(1)}
          </Typography>
          {children}
        </CardContent>
      </StyledCard>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ maxWidth: `${NODE_MAX_WIDTH}px`, margin: 'auto', padding: '20px', bgcolor: 'background.paper', borderRadius: '8px' }}>
          <Typography variant="subtitle2" gutterBottom>
            {nodetype.charAt(0).toUpperCase() + nodetype.slice(1)}
          </Typography>
          {children}
        </Box>
      </Modal>
    </>
  );
};

export const ConclusionNode = ({ data }) => (
  <NodeWrapper nodetype="conclusion">
    <Handle type="target" id="target-handle-top" position="top" />
    <Handle type="source" id="source-handle-bottom" position="bottom" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);

export const PremiseNode = ({ data }) => (
  <NodeWrapper nodetype="premise">
    <Handle type="target" id="target-handle-top" position="top" />
    <Handle type="source" id="source-handle-bottom" position="bottom" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);

export const AssumptionNode = ({ data }) => (
  <NodeWrapper nodetype="assumption">
    <Handle type="target" id="target-handle-top" position="top" />
    <Handle type="source" id="source-handle-bottom" position="bottom" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);