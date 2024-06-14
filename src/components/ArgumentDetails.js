import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  cursor: 'pointer',
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

  const [expandedSections, setExpandedSections] = useState({
    Conclusion: true,
    Premises: true,
    Assumptions: true,
    Validity: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', marginTop: '10px', boxSizing: 'border-box' }}>
      {isArgument ? (
        <>
          <Accordion expanded={expandedSections.Conclusion} onChange={() => toggleSection('Conclusion')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} sx={{ backgroundColor: 'rgba(38, 75, 150, 1)' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Conclusion</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '10px', border: '2px solid rgba(38, 75, 150, 1)' }}>
              <Typography variant="body1" sx={{ color: 'black', textAlign: 'left' }}>
                {parsedResponse['Conclusion']}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expandedSections.Premises} onChange={() => toggleSection('Premises')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} sx={{ backgroundColor: 'rgba(0, 111, 60, 1)' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Premises</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '10px', border: '2px solid rgba(0, 111, 60, 1)' }}>
              {parsedResponse['Premises']?.split('\n').map((item, index) => (
                <Typography key={index} variant="body1" sx={{ color: 'black', textAlign: 'left' }}>
                  {item}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expandedSections.Assumptions} onChange={() => toggleSection('Assumptions')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} sx={{ backgroundColor: 'rgba(191, 33, 47, 1)' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Assumptions</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '10px', border: '2px solid rgba(191, 33, 47, 1)' }}>
              {parsedResponse['Assumptions']?.split('\n').map((item, index) => (
                <Typography key={index} variant="body1" sx={{ color: 'black', textAlign: 'left' }}>
                  {item}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expandedSections.Validity} onChange={() => toggleSection('Validity')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Validity</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '10px', border: '2px solid rgba(0, 0, 0, 0.8)' }}>
              <Typography variant="body1" sx={{ color: 'black', textAlign: 'left' }}>
                {parsedResponse['Validity']}
              </Typography>
            </AccordionDetails>
          </Accordion>
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
