import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { getFeaturedServices } from "@/lib/api/services";


export default async function HomePage() {
  const featuredServices = await getFeaturedServices(6);

  return (
    <main className="w-full min-h-screen">
      <Hero />
      <Ticker />
      <FeaturedServices services={featuredServices} />
    </main>
  );
}