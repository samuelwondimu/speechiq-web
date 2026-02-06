import { FAQ } from "@/components/landing-page/faq";
import { Features } from "@/components/landing-page/Features";
import { Footer } from "@/components/landing-page/footer";
import { Hero } from "@/components/landing-page/hero";
import { Navbar } from "@/components/landing-page/navbar";
// import { Pricing } from "@/components/landing-page/pricing";
import { Testimonials } from "@/components/landing-page/testimonials";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      {/* <Pricing /> */}
      <FAQ />
      <Footer />
    </>
  );
}
