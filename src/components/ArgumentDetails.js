import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ bgcolor }) => ({
  width: '100%',
  maxWidth: '600px',
  margin: '10px 0',
  padding: '10px',
  backgroundColor: bgcolor,
  color: 'white',
  borderRadius: '4px',
  boxSizing: 'border-box',
}));

const ArgumentDetails = ({ response }) => {
  const parseResponse = (response) => {
    const sections = {};
    const lines = response.split('\n');
    let currentSection = '';

    lines.forEach((line) => {
      if (line.trim() === '') return;

      const match = line.match(/^(Conclusion|Premises|Assumptions|Validity|Argument Status):\s*(.*)$/i);
      if (match) {
        currentSection = match[1];
        sections[currentSection] = match[2].trim();
      } else if (currentSection) {
        sections[currentSection] += '\n' + line.trim();
      }
    });

    return sections;
  };

  const normalizeStatus = (status) => {
    return status.replace(/[.,\s]+$/, '').toLowerCase();
  };

  const parsedResponse = response ? parseResponse(response) : {};
  const isArgument = normalizeStatus(parsedResponse['Argument Status'] || '') === 'this is an argument';

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', marginTop: '10px', boxSizing: 'border-box' }}>
      {isArgument ? (
        <>
          <Container bgcolor="rgba(38, 75, 150, 1)"> {/* Light blue background */}
            <Typography variant="h6" align="left">Conclusion</Typography>
          </Container>
          <Typography variant="body1" sx={{ marginTop: '10px', color: 'black', textAlign: 'left' }}>
            {parsedResponse['Conclusion']}
          </Typography>
          <Container bgcolor="rgba(0, 111, 60, 1)"> {/* Light green background */}
            <Typography variant="h6" align="left">Premises</Typography>
          </Container>
          {parsedResponse['Premises']?.split('\n').map((item, index) => (
            <Typography key={index} variant="body1" sx={{ marginTop: '10px', color: 'black', textAlign: 'left' }}>
              {item}
            </Typography>
          ))}
          <Container bgcolor="rgba(191, 33, 47, 1)"> {/* Light red background */}
            <Typography variant="h6" align="left">Assumptions</Typography>
          </Container>
          {parsedResponse['Assumptions']?.split('\n').map((item, index) => (
            <Typography key={index} variant="body1" sx={{ marginTop: '10px', color: 'black', textAlign: 'left' }}>
              {item}
            </Typography>
          ))}
          <Container bgcolor="rgba(0, 0, 0, 0.8)">
            <Typography variant="h6">Validity</Typography>
          </Container>
          <Typography variant="body1" sx={{ marginTop: '10px', color: 'black', textAlign: 'left' }}>
            {parsedResponse['Validity']}
          </Typography>
        </>
      ) : (
        <Typography variant="body1" sx={{ marginTop: '10px', color: 'black' }}>
          The input text does not contain an argument.
        </Typography>
      )}
    </Box>
  );
};

export default ArgumentDetails;
