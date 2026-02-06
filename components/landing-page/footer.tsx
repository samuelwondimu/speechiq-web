import { Speech } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="mx-auto max-w-full mt-2 border-primary" />
      <section className="mx-auto max-w-7xl py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 px-4 md:px-0 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Speech className="size-6" />
            </div>
            Speech IQ.
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow US</h3>
          <div>
            <Button variant="link" className="pl-0">
              <a
                rel="noreferrer noopener"
                href="https://twitter.com/samuelwondimu"
              >
                Twitter
              </a>
            </Button>
          </div>

          <div>
            <Button variant="link" className="pl-0">
              <a
                rel="noreferrer noopener"
                href="https://www.linkedin.com/in/speechiq/"
              >
                LinkedIn
              </a>
            </Button>
          </div>
          <div>
            <Button variant="link" className="pl-0">
              <a
                rel="noreferrer noopener"
                href="https://www.instagram.com/speechiq.app/"
              >
                Instagram
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Platforms</h3>
          <div>
            <Button variant="link" className="pl-0">
              Web
            </Button>
          </div>

          <div>
            <Button variant="link" disabled className="pl-0">
              Mobile (coming soon)
            </Button>
          </div>

          <div>
            <Button variant="link" disabled className="pl-0">
              Desktop App (coming soon)
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">About</h3>
          <div>
            <Button variant="link" className="pl-0">
              <a rel="noreferrer noopener" key="#features" href="#features">
                Features
              </a>
            </Button>
          </div>

          <div>
            <Button variant="link" className="pl-0">
              <a
                rel="noreferrer noopener"
                key="#testimonials"
                href="#testimonials"
              >
                Testimonals
              </a>
            </Button>
          </div>

          <div>
            <Button variant="link" className="pl-0">
              <a rel="noreferrer noopener" key="#faq" href="#faq">
                FAQ
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl pb-14 text-center">
        <h3>
          &copy; 2024 Speech IQ. Built by{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.linkedin.com/in/samuelwondimu/"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            samuel wondimu
          </a>
        </h3>
      </section>
    </footer>
  );
};
