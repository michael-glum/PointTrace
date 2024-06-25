export const parseArgumentResponse = (responseContent) => {
  // Split the response content into lines
  const lines = responseContent.split('\n').map(line => line.trim()).filter(line => line);

  // Initialize variables to store different parts of the argument
  let currentArgument = null;
  const myArguments = [];

  // Helper function to add a new argument
  const addNewArgument = () => {
      if (currentArgument) {
          myArguments.push(currentArgument);
      }
      currentArgument = {
          conclusion: '',
          premises: [],
          explicitAssumptions: [],
          implicitAssumptions: [],
          validity: '',
          argumentStatus: ''
      };
  };

  // Ensure an argument is always initialized
  addNewArgument();

  // Iterate over the lines to extract information
  lines.forEach(line => {
      if (line.startsWith('• Conclusion:')) {
          if (currentArgument) addNewArgument();
          currentArgument.conclusion = line.replace('• Conclusion:', '').trim();
      } else if (line.startsWith('• Premises:')) {
          // Premises section starts
      } else if (line.startsWith('• Explicit Assumptions:')) {
          // Explicit Assumptions section starts
      } else if (line.startsWith('• Implicit Assumptions:')) {
          // Implicit Assumptions section starts
      } else if (line.startsWith('• Validity:')) {
          currentArgument.validity = line.replace('• Validity:', '').trim();
      } else if (line.startsWith('• Argument Status:')) {
          currentArgument.argumentStatus = line.replace('• Argument Status:', '').trim();
      } else if (line.match(/^\d+\.\s/)) {
          // Handle numbered lines for premises and assumptions
          const premiseMatch = line.match(/^\d+\.\s*(.*)$/);
          if (premiseMatch) {
              currentArgument.premises.push(premiseMatch[1].trim());
          } else {
              const explicitAssumptionMatch = line.match(/^(.*)\s*\(Premise #(\d+)\)$/);
              if (explicitAssumptionMatch) {
                  currentArgument.explicitAssumptions.push({
                      text: explicitAssumptionMatch[1].trim(),
                      premiseIndex: parseInt(explicitAssumptionMatch[2]) - 1,
                  });
              } else {
                  const implicitAssumptionMatch = line.match(/^(.*)\s*\(Derived from Premise #(\d+)\)$/);
                  if (implicitAssumptionMatch) {
                      currentArgument.implicitAssumptions.push({
                          text: implicitAssumptionMatch[1].trim(),
                          premiseIndex: parseInt(implicitAssumptionMatch[2]) - 1,
                      });
                  }
              }
          }
      }
  });

  if (currentArgument.conclusion) {
    myArguments.push(currentArgument);
}

return myArguments;
};