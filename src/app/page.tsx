import { AboutAgatha } from "@/components/AboutAgatha";
import { Countdown } from "@/components/Countdown";
import { EventDetails } from "@/components/EventDetails";
import { FamilySection } from "@/components/FamilySection";
import { Footer } from "@/components/Footer";
import { GiftSuggestions } from "@/components/GiftSuggestions";
import { HeroSection } from "@/components/HeroSection";
import { LocationShortcut } from "@/components/LocationShortcut";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RSVPForm } from "@/components/RSVPForm";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <LocationShortcut />
      <Countdown />
      <AboutAgatha />
      <PhotoGallery />
      <EventDetails />
      <GiftSuggestions />
      <RSVPForm />
      <FamilySection />
      <Footer />
    </main>
  );
}
