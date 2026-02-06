import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is SpeechIQ?",
    answer:
      "SpeechIQ is an AI-powered speaking coach that helps you practice speaking out loud and receive instant feedback on clarity, confidence, pacing, and filler words. It’s built for interviews, presentations, pitches, and everyday communication.",
    value: "item-1",
  },
  {
    question: "How does SpeechIQ analyze my speech?",
    answer:
      "After you record a session, SpeechIQ transcribes your speech and analyzes key delivery metrics like speaking speed, pauses, and filler words. These metrics are then used to generate clear, structured feedback you can act on immediately.",
    value: "item-2",
  },
  {
    question: "Do I need special equipment to use SpeechIQ?",
    answer:
      "No. SpeechIQ works directly in your browser using your device’s microphone. You can practice from your laptop or phone without any additional setup.",
    value: "item-3",
  },
  {
    question: "Is my voice data private?",
    answer:
      "Yes. Your recordings and transcripts are private to your account and are used only to generate your feedback. We don’t share your data, and you can delete your sessions at any time.",
    value: "item-4",
  },
  {
    question: "Is SpeechIQ free to use?",
    answer:
      "SpeechIQ offers a free plan with limited practice sessions. You can upgrade to a Pro plan for unlimited sessions, detailed feedback, and progress tracking.",
    value: "item-5",
  },
  {
    question: "Who is SpeechIQ best for?",
    answer:
      "SpeechIQ is ideal for students, professionals, founders, and anyone who wants to improve how they speak. Whether you’re preparing for an interview, a presentation, or a pitch, SpeechIQ helps you practice with confidence.",
    value: "item-6",
  },
];


export const FAQ = () => {
  return (
    <section id="faq" className="mx-auto max-w-7xl py-24 px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left text-foreground text-xl">
              {question}
            </AccordionTrigger>

            <AccordionContent className="text-lg text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
