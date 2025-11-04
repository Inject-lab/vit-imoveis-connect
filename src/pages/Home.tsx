import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoryCards from '@/components/home/CategoryCards';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AboutSection from '@/components/home/AboutSection';
import DifferentialsSection from '@/components/home/DifferentialsSection';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <CategoryCards />
        <FeaturedProperties />
        <AboutSection />
        <DifferentialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
