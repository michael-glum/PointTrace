import React, { useState, useCallback } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
  minWidth: '300px',
  maxWidth: '600px',
  width: '100%',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
});

const ArgumentInputCard = ({ onSubmit, isSubmitting }) => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChange = useCallback((event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsValid(value.trim().length > 0);
    setIsSubmitted(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (isValid) {
      onSubmit(inputValue);
      setIsSubmitted(true);
      setIsCollapsed(true);
    }
  }, [inputValue, isValid, onSubmit]);

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
              onClick={stopPropagation}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                stopPropagation(e);
                handleSubmit();
              }}
              disabled={!isValid || isSubmitting || isSubmitted}
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
            "{inputValue}"
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default ArgumentInputCard;