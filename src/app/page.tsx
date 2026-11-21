import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { PopularCategories } from "@/components/home/PopularCategories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen">
      <Hero />
      <Ticker />
      <FeaturedServices />
      <HowItWorks />
      <PopularCategories />
      <WhyChooseUs />
    </main>
  );
}