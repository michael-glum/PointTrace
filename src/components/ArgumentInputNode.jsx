import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { initiateArgument } from '../slices/argumentSlice';
import { throttle } from 'lodash';
import { Handle } from 'reactflow';

const StyledCard = styled(Card)({
  minWidth: '300px',
  maxWidth: '600px',
  width: '100%',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const ArgumentInputNode = ({ data }) => {
  const [inputValue, setInputValue] = useState(data?.text || '');
  const [isValid, setIsValid] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const nodeId = data?.nodeId;
  const nodeState = useSelector(state => state.argument.nodes[nodeId] || { loading: false, error: false, response: ''});
  const { loading, error, response } = nodeState;

  const dispatch = useDispatch();

  const handleChange = useCallback((event) => {
    event.stopPropagation();
    const value = event.target.value;
    setInputValue(value);
    setIsValid(value.trim().length > 0);
  }, []);

  const handleFocus = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const throttledDispatch = throttle((value) => {
      dispatch(initiateArgument({ input: value, nodeId }));
    }, 2000);

  const handleSubmit = useCallback((event) => {
    event.stopPropagation();
    if (isValid) {
      throttledDispatch(inputValue);
      setIsSubmitting(true);
      setIsValid(false);
    }
  }, [inputValue, isValid, throttledDispatch]);

  useEffect(() => {
    console.log("loading:", loading);
    if (!loading && isSubmitting) {
      setIsCollapsed(true);
      setIsSubmitting(false);
    }
  }, [loading, isSubmitting]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <StyledCard onClick={toggleCollapse}>
      <Handle type="source" position="bottom" />
      <CardContent>
        <Typography variant="h5" component="div" textAlign="center" gutterBottom>
          Argument Input
        </Typography>
        {!isCollapsed && (
          <>
            <TextField
              label="Enter argument text"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              margin="normal"
              value={inputValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onClick={stopPropagation}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                backgroundColor: isValid ? 'rgba(38, 75, 150, 1)' : 'rgba(38, 75, 150, 0.5)',
                '&:hover': {
                  backgroundColor: isValid ? 'rgba(38, 75, 150, 0.8)' : 'rgba(38, 75, 150, 0.5)',
                },
              }}
            >
              {loading ? 'Analyzing...' : 'Submit'}
            </Button>
            {error && <Typography variant="body2" color="error">{error}</Typography>}
          </>
        )}
        {isCollapsed && (
          <Typography variant="body2" sx={{ marginTop: '10px' }}>
            {inputValue}
          </Typography>
        )}
        {response && (
          <Typography variant="body2" sx={{ marginTop: '10px' }}>
            {response}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default ArgumentInputNode;