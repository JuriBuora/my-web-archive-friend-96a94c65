import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="inline-block mb-4">
          <span className="font-mono text-sm text-terminal-green tracking-widest uppercase">
            ~/juri-buora
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          From Zero to{" "}
          <span className="text-primary text-glow">Cybersecurity</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          A public, structured learning log documenting the journey into
          cybersecurity — what I study, build, break, misunderstand, and
          eventually learn to do properly.
        </p>
        <div className="flex flex-wrap gap-3 justify-center font-mono text-sm text-terminal-dim">
          <span className="border border-border rounded px-3 py-1">59 daily logs</span>
          <span className="border border-border rounded px-3 py-1">4 labs</span>
          <span className="border border-border rounded px-3 py-1">Jan–Mar 2026</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
