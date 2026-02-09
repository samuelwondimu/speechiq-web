export const practiceTypeData = [
  {
    name: "Speech Practice",
    description:
      "Practice your speech and receive feedback on your performance.",
    value: "speech-practice",
  },
  {
    name: "Q&A Practice",
    description:
      "Practice answering common interview questions and get feedback on your responses.",
    value: "qa-practice",
  },
];

export const questions = [
  {
    id: 1,
    text: "Introduce yourself in 30 seconds",
    hint: "Focus on name, role, and one achievement",
  },
  {
    id: 2,
    text: "Describe a recent challenge you solved",
    hint: "State the problem and your approach",
  },
  {
    id: 3,
    text: "Pitch your product in one minute",
    hint: "Highlight value and audience",
  },
];

export enum PracticeTabs {
  PracticeSetup = "practice-setup",
  Recording = "recording",
  Analysis = "analysis",
  Report = "report",
}
