import HeroSection from '../components/home/HeroSection';
import ProgramCards from '../components/home/ProgramCards';
import MemberPods from '../components/home/MemberPods';
import EventPreview from '../components/home/EventPreview';
import GalleryPreview from '../components/home/GalleryPreview';
import TestimonialSlider from '../components/home/TestimonialSlider';
import CTASection from '../components/home/CTASection';
import { useSeo } from '../hooks/useSeo';

export default function HomePage() {
  useSeo({
    title: 'Pramuka SMK Marhas Margahayu — Gugus Depan Trigantara',
    description:
      'Website resmi Gugus Depan Trigantara (29.039 – 29.040), Pramuka SMK Marhas Margahayu, Bandung. ' +
      'Materi kepramukaan lengkap, agenda kegiatan, galeri, dan pendaftaran anggota baru.',
    path: '/',
  });

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
