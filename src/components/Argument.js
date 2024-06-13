import React, { useState, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { throttle } from 'lodash';
import ArgumentInputCard from './ArgumentInputCard';
import ArgumentDetails from './ArgumentDetails';
import { fetchGPTResponse } from '../services/openai';

const Argument = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([
    { role: 'system', content: 'You are an assistant that analyzes arguments and breaks them down into Conclusion, Premises, and Assumptions. Additionally, evaluate the validity of the argument.' }
  ]);

  const throttledFetch = useCallback(
    throttle(async (inputValue, history) => {
      setLoading(true);
      setError('');

      const newMessage = {
        role: 'user', 
        content: `Analyze the following text and determine if it contains an argument. If it does, break it down into Conclusion, Premises, and Assumptions in their simplest forms. Additionally, evaluate the validity of the argument. If the text does not contain an argument, clearly state that it is not an argument.
        Text: "${inputValue}"
        Response Format:
        Conclusion: [state the conclusion]
        Premises: [list the premises]
        Assumptions: [list the assumptions]
        Validity: [state if the argument is valid and why]
        Argument Status: [state "This is an argument" or "This is not an argument"]
        `
      };

      const updatedHistory = [...history, newMessage];
      try {
        const gptResponse = await fetchGPTResponse(updatedHistory);
        if (gptResponse.choices && gptResponse.choices[0] && gptResponse.choices[0].message.content) {
          setResponse(gptResponse.choices[0].message.content);
          setConversationHistory(updatedHistory);
          console.log(gptResponse.choices[0].message.content);
        } else {
          setError('No response received.');
        }
        setSubmitted(true);
      } catch (e) {
        console.error('Error fetching GPT response', e);
        setError('Error fetching response.');
      } finally {
        setLoading(false);
      }
    }, 2000), // Throttle to allow only one request per 2 seconds
    []
  );

  const handleSubmit = useCallback((inputValue) => {
    throttledFetch(inputValue, conversationHistory);
  }, [conversationHistory, throttledFetch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <ArgumentInputCard onSubmit={handleSubmit} isSubmitting={loading} />
      {loading && <CircularProgress />}
      {submitted && error && (
        <Typography variant="body1" sx={{ marginTop: '20px', color: 'red' }}>
          {error}
        </Typography>
      )}
      {submitted && response && !error && <ArgumentDetails response={response} />}
    </Box>
  );
};

export default Argument;
