export const makeInputPrompt = (inputValue) => {
    return `Analyze the following text and determine if it contains an argument.
        If it does, break it down into Conclusion, Premises, and Assumptions in their simplest forms.
        Ensure you include both explicit and implicit assumptions, noting the premise each assumption is derived from.
        Additionally, evaluate the validity of the argument.
        If the text does not contain an argument, clearly state that it is not an argument.
        If there are multiple sides being argued, compare the different arguments.
        Determine if the arguments are equivalent and identify the true points of contention within the argument, such as misalignment of their premises or assumptions.

        Text: "${inputValue}"
        Response Format:

        •	Conclusion: [state the conclusion]
        •	Premises: [list the premises]
        •	Explicit Assumptions: [list the explicit assumptions and the premise each assumption is derived from]
        •	Implicit Assumptions: [list the implicit assumptions, considering all underlying ideas or conditions that must be true for the argument to hold, and the premise each assumption is derived from]
        •	Validity: [state if the argument is valid based solely on the premises and why]
        •	Argument Status: [state “This is an argument” or “This is not an argument”]

        If there are multiple sides:

        •	Argument 1:
        •	Conclusion: [state the conclusion]
        •	Premises: [list the premises]
        •	Explicit Assumptions: [list the explicit assumptions and the premise each assumption is derived from]
        •	Implicit Assumptions: [list the implicit assumptions, considering all underlying ideas or conditions that must be true for the argument to hold, and the premise each assumption is derived from]
        •	Validity: [state if the argument is valid based solely on the premises and why]
        •	Argument 2:
        •	Conclusion: [state the conclusion]
        •	Premises: [list the premises]
        •	Explicit Assumptions: [list the explicit assumptions and the premise each assumption is derived from]
        •	Implicit Assumptions: [list the implicit assumptions, considering all underlying ideas or conditions that must be true for the argument to hold, and the premise each assumption is derived from]
        •	Validity: [state if the argument is valid based solely on the premises and why]
        •	Equivalence: [determine if the arguments are equivalent and explain why or why not]
        •	Points of Contention: [identify the true points of contention within the arguments, such as misalignment of their premises or assumptions]

        Example Response:

        •	Conclusion: [Example conclusion]
        •	Premises:
        1.	[Example premise]
        2.	[Example premise]
        •	Explicit Assumptions:
        1.	[Example explicit assumption] (Premise #)
        2.	[Example explicit assumption] (Premise #)
        •	Implicit Assumptions:
        1.	[Example implicit assumption] (Premise #)
        2.	[Example implicit assumption] (Premise #)
        •	Validity: [Example validity analysis based on premises]
        •	Argument Status: [Example argument status]

        If there are multiple sides:

        •	Argument 1:
        •	Conclusion: [Example conclusion]
        •	Premises:
        1.	[Example premise]
        2.	[Example premise]
        •	Explicit Assumptions:
        1.	[Example explicit assumption] (Premise #)
        2.	[Example explicit assumption] (Premise #)
        •	Implicit Assumptions:
        1.	[Example implicit assumption] (Premise #)
        2.	[Example implicit assumption] (Premise #)
        •	Validity: [Example validity analysis based on premises]
        •	Argument 2:
        •	Conclusion: [Example conclusion]
        •	Premises:
        1.	[Example premise]
        2.	[Example premise]
        •	Explicit Assumptions:
        1.	[Example explicit assumption] (Premise #)
        2.	[Example explicit assumption] (Premise #)
        •	Implicit Assumptions:
        1.	[Example implicit assumption] (Premise #)
        2.	[Example implicit assumption] (Premise #)
        •	Validity: [Example validity analysis based on premises]
        •	Equivalence: [Example equivalence analysis]
        •	Points of Contention: [Example points of contention analysis]
    `;
};

export const InitialInstructions = 'You are an assistant that analyzes arguments and breaks them down into Conclusion, Premises, and Assumptions. Additionally, evaluate the validity of the argument based solely on the premises.';