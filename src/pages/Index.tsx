import BlogHeader from "@/components/BlogHeader";
import ScrollToTop from "@/components/ScrollToTop";
import HeroSection from "@/components/HeroSection";
import ProgressTimeline from "@/components/ProgressTimeline";
import PostList from "@/components/PostList";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <BlogHeader />
      <HeroSection />
      <ProgressTimeline />
      <AboutSection />
      <PostList />
      <footer className="border-t border-border py-8 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          © 2026 Juri Buora · From Zero to Cybersecurity
        </p>
      </footer>
    </div>
  );
};

export default Index;
