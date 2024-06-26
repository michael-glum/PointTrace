export const parseArgumentResponse = (responseContent) => {
  const lines = responseContent.split('\n').map(line => line.trim()).filter(line => line);

  let currentArgument = null;
  const parsedArguments = [];
  let currentSection = '';

  const SECTION_KEYS = {
    CONCLUSION: 'Conclusion:',
    PREMISES: 'Premises:',
    EXPLICIT_ASSUMPTIONS: 'Explicit Assumptions:',
    IMPLICIT_ASSUMPTIONS: 'Implicit Assumptions:',
    VALIDITY: 'Validity:',
    ARGUMENT_STATUS: 'Argument Status:',
  };

  // Helper function to add a new argument
  const addNewArgument = () => {
    if (currentArgument && currentArgument.conclusion) {
      parsedArguments.push(currentArgument);
    }
    currentArgument = {
      conclusion: '',
      premises: [],
      explicitAssumptions: [],
      implicitAssumptions: [],
      validity: '',
      argumentStatus: ''
    };
    currentSection = '';
  };

  // Regular expression to match "Argument X:"
  const argumentHeaderRegex = /^Argument \d+:/;

  // Iterate over the lines to extract information
  lines.forEach(line => {
    if (argumentHeaderRegex.test(line)) {
      addNewArgument(); // Ensure the current argument is saved before starting a new one
    } else if (line.startsWith(SECTION_KEYS.CONCLUSION)) {
      currentSection = 'conclusion';
      currentArgument.conclusion = line.replace(SECTION_KEYS.CONCLUSION, '').trim();
    } else if (line.startsWith(SECTION_KEYS.PREMISES)) {
      currentSection = 'premises';
    } else if (line.startsWith(SECTION_KEYS.EXPLICIT_ASSUMPTIONS)) {
      currentSection = 'explicitAssumptions';
    } else if (line.startsWith(SECTION_KEYS.IMPLICIT_ASSUMPTIONS)) {
      currentSection = 'implicitAssumptions';
    } else if (line.startsWith(SECTION_KEYS.VALIDITY)) {
      currentSection = 'validity';
      currentArgument.validity = line.replace(SECTION_KEYS.VALIDITY, '').trim();
    } else if (line.startsWith(SECTION_KEYS.ARGUMENT_STATUS)) {
      currentSection = 'argumentStatus';
      currentArgument.argumentStatus = line.replace(SECTION_KEYS.ARGUMENT_STATUS, '').trim();
    } else if (line.startsWith('- ')) {
      const content = line.replace('- ', '').trim();
      if (currentSection === 'premises') {
        currentArgument.premises.push(content);
      } else if (currentSection === 'explicitAssumptions') {
        currentArgument.explicitAssumptions.push({ text: content, premiseIndex: currentArgument.premises.length - 1 });
      } else if (currentSection === 'implicitAssumptions') {
        currentArgument.implicitAssumptions.push({ text: content, premiseIndex: currentArgument.premises.length - 1 });
      }
    }
  });

  // Add the last argument if it has a conclusion
  addNewArgument();

  return parsedArguments;
};
