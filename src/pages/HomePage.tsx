import HeroSection from '../components/home/HeroSection';
import ProgramCards from '../components/home/ProgramCards';
import MemberPods from '../components/home/MemberPods';
import EventPreview from '../components/home/EventPreview';
import GalleryPreview from '../components/home/GalleryPreview';
import TestimonialSlider from '../components/home/TestimonialSlider';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProgramCards />
      <MemberPods />
      <EventPreview />
      <GalleryPreview />
      <TestimonialSlider />
      <CTASection />
    </main>
  );
}
