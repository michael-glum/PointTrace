export const parseArgumentResponse = (response) => {
    const conclusionMatch = response.match(/Conclusion:\s*(.*)/);
    const premisesMatch = response.match(/Premises:\s*([\s\S]*?)\s*(Assumptions|Validity|Argument Status):/);
    const assumptionsMatch = response.match(/Assumptions:\s*([\s\S]*?)\s*(Validity|Argument Status):/);
    const validityMatch = response.match(/Validity:\s*(.*)/);
    const argumentStatusMatch = response.match(/Argument Status:\s*(.*)/);
  
    const conclusion = conclusionMatch ? conclusionMatch[1].trim() : 'No conclusion found';
    const premises = premisesMatch ? premisesMatch[1].trim().split(/\n\s*/) : [];
    const assumptions = assumptionsMatch ? assumptionsMatch[1].trim().split(/\n\s*/) : [];
    const validity = validityMatch ? validityMatch[1].trim() : 'No validity statement found';
    const argumentStatus = argumentStatusMatch ? argumentStatusMatch[1].trim() : 'No argument status found';
  
    return {
      conclusion,
      premises,
      assumptions,
      validity,
      argumentStatus,
    };
  };