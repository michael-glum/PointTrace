import React from 'react';
import { Handle } from 'reactflow';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, nodetype }) => ({
  minWidth: '150px',
  maxWidth: '300px',
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

const NodeWrapper = ({ nodetype, children }) => (
  <StyledCard nodetype={nodetype}>
    <CardContent>
      <Typography variant="subtitle2" gutterBottom>
        {nodetype.charAt(0).toUpperCase() + nodetype.slice(1)}
      </Typography>
      {children}
    </CardContent>
  </StyledCard>
);

export const ConclusionNode = ({ data }) => (
  <NodeWrapper nodetype="conclusion">
    <Handle type="source" position="bottom" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);

export const PremiseNode = ({ data }) => (
  <NodeWrapper nodetype="premise">
    <Handle type="target" position="top" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);

export const AssumptionNode = ({ data }) => (
  <NodeWrapper nodetype="assumption">
    <Handle type="target" position="top" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);