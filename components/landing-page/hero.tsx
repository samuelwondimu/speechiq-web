import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 max-w-7xl mx-auto px-6">
      <div className="text-center lg:text-start space-y-6 max-w-2xl">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            Become a{" "}
            <span className="inline bg-linear-to-r from-primary to-primary/20 text-transparent bg-clip-text animate-gradient">
              Confident Speaker
            </span>
          </h1>{" "}
          <h2 className="inline">
            with{" "}
            <span className="inline bg-linear-to-r from-primary/20 via-primary/50 to-primary text-transparent bg-clip-text animate-gradient">
              AI Coaching
            </span>
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Practice your speeches and get instant AI feedback on clarity,
          confidence, pacing, and filler words improve every time you speak.
        </p>

        <div className="flex justify-center lg:justify-start space-y-4 md:space-y-0 md:space-x-4">
          <Button size="xl" className="w-full md:w-1/3" disabled>
            <Link href="/login">Coming soon</Link>
          </Button>
        </div>
      </div>

      <div className="z-10">{/* Hero visual / dashboard preview */}</div>
    </section>
  );
};
