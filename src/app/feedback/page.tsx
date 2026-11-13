import type { Metadata } from "next";
import SiteHeader from "@/components/navigation/SiteHeader";
import SiteFooter from "@/components/navigation/SiteFooter";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Guest feedback",
};

export default function FeedbackPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <main>
        <section className="bg-cream pb-14 pt-16 md:pb-16 md:pt-24">
          <div className="container-narrow text-center">
            <p className="overline">Guest voices</p>
            <h1 className="heading-lg mt-5 text-charcoal">
              Your feedback matters
            </h1>
            <p className="lede mx-auto mt-5 max-w-xl">
              We strive to provide the ultimate luxury experience. Let us know
              how we did — or how we can do better.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container-narrow">
            <Reveal>
              <FeedbackForm />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
