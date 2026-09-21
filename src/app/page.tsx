import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeatureStrip from "@/components/home/FeatureStrip";
import PopularTrips from "@/components/home/PopularTrips";
import PopularDestinations from "@/components/home/PopularDestinations";
import AwardBanner from "@/components/home/AwardBanner";
import HowItWorks from "@/components/home/HowItWorks";
import TopActivities from "@/components/home/TopActivities";
import AboutSection from "@/components/home/AboutSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import PartnersStrip from "@/components/home/PartnersStrip";
import NewsSection from "@/components/home/NewsSection";
import FAQSection from "@/components/home/FAQSection";
import StatsStrip from "@/components/home/StatsStrip";
import CTABanner from "@/components/home/CTABanner";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <FeatureStrip />
        <PopularTrips />
        <PopularDestinations />
        <AwardBanner />
        <HowItWorks />
        <TopActivities />
        <AboutSection />
        <TestimonialSection />
        <PartnersStrip />
        <NewsSection />
        <FAQSection />
        <StatsStrip />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
