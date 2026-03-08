import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Ecosystem } from "@/components/ecosystem";
import { HowItWorks } from "@/components/how-it-works";
import { QuickStart } from "@/components/quickstart";
import { Spec } from "@/components/spec";
import { OpenSource } from "@/components/opensource";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="noise-bg">
      <Navbar />
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <QuickStart />
        <Spec />
        <Ecosystem />
        <OpenSource />
      </main>
      <Footer />
    </div>
  );
}