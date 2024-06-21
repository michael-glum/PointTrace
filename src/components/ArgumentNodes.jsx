import React from 'react';
import { Handle } from 'reactflow';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, nodeType }) => ({
  minWidth: '150px',
  maxWidth: '300px',
  padding: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  backgroundColor: 
    nodeType === 'conclusion' ? theme.palette.primary.light :
    nodeType === 'premise' ? theme.palette.secondary.light :
    theme.palette.warning.light,
}));

const NodeWrapper = ({ nodeType, children }) => (
  <StyledCard nodeType={nodeType}>
    <CardContent>
      <Typography variant="subtitle2" gutterBottom>
        {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
      </Typography>
      {children}
    </CardContent>
  </StyledCard>
);

export const ConclusionNode = ({ data }) => (
  <NodeWrapper nodeType="conclusion">
    <Handle type="source" position="bottom" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);

export const PremiseNode = ({ data }) => (
  <NodeWrapper nodeType="premise">
    <Handle type="target" position="top" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);

export const AssumptionNode = ({ data }) => (
  <NodeWrapper nodeType="assumption">
    <Handle type="target" position="top" />
    <Typography variant="body2">{data.label}</Typography>
  </NodeWrapper>
);