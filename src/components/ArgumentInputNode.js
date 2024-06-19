import React, { useState, useCallback } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
  minWidth: '300px',
  maxWidth: '600px',
  width: '100%',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const ArgumentInputNode = React.memo(({ data }) => {
  const [inputValue, setInputValue] = useState(data.text || '');
  const [isValid, setIsValid] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChange = useCallback((event) => {
    event.stopPropagation();
    const value = event.target.value;
    setInputValue(value);
    setIsValid(value.trim().length > 0);
  }, []);

  const handleFocus = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleSubmit = useCallback((event) => {
    event.stopPropagation();
    if (isValid) {
      data.onSubmit(inputValue);
      setIsCollapsed(true);
      setIsValid(false);
    }
  }, [inputValue, isValid, data]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <StyledCard onClick={toggleCollapse}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
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
              Submit
            </Button>
          </>
        )}
        {isCollapsed && (
          <Typography variant="body2" sx={{ marginTop: '10px' }}>
            {inputValue}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
});

export default ArgumentInputNode;