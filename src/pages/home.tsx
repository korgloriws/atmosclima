import { useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Services } from '@/components/services';
import { About } from '@/components/about';
import { Advantages } from '@/components/advantages';
import { Gallery } from '@/components/gallery';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export default function Home() {
  useScrollReveal();

  useEffect(() => {
    // Basic smooth scroll for hash links if any
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-secondary selection:text-secondary-foreground">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Advantages />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
