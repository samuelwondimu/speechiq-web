import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "",
    name: "Founding User",
    userName: "Early Access",
    comment:
      "I’ve practiced speeches before, but I never had clear feedback on what was actually holding me back. SpeakIQ pointed out how often I was using filler words and rushing through key points. After just a few practice sessions, my delivery already feels more intentional and confident.",
  },
  {
    image: "",
    name: "Startup Founder",
    userName: "Pitch Practice",
    comment:
      "I used SpeakIQ to rehearse an investor pitch and the pacing and clarity feedback was surprisingly accurate. Seeing my words-per-minute and pauses visualized made it obvious where I was losing emphasis. It’s like having a speaking coach available whenever you need one.",
  },
  {
    image: "",
    name: "Job Seeker",
    userName: "Interview Prep",
    comment:
      "Practicing interview answers out loud usually feels awkward, but the AI feedback made it genuinely useful. The transcript highlights and confidence notes helped me tighten my answers and sound more composed instead of rambling.",
  },
  {
    image: "",
    name: "Product Manager",
    userName: "Presentation Skills",
    comment:
      "I give a lot of internal presentations, and SpeakIQ helped me realize where my explanations were unclear. The feedback isn’t generic — it points out specific moments where you lose clarity or energy. That level of detail is what makes it valuable.",
  },
  {
    image: "",
    name: "Student",
    userName: "Public Speaking",
    comment:
      "Public speaking has always been stressful for me. Using SpeakIQ to practice in private first made a huge difference. I could repeat sessions, track improvement, and slowly build confidence before speaking in front of others.",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold">
        Early
        <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Voices{" "}
        </span>
        from SpeechIQ
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Feedback from early users shaping the future of SpeechIQ.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage alt="" src={image} />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="text-lg">{comment}</CardContent>
            </Card>
          ),
        )}
      </div>
    </section>
  );
};
