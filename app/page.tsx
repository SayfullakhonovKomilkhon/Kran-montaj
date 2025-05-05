import ServiceSection from './components/ServiceSection';
import CatalogSection from './components/CatalogSection';
import VideoHero from './components/VideoHero';
import ExperienceSection from './components/ExperienceSection';

export default function Home() {
  return (
    <>
      <VideoHero />
      <ServiceSection />
      <CatalogSection />
      <ExperienceSection />
    </>
  );
}
