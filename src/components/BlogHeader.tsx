import { Shield, Github } from "lucide-react";

const BlogHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm font-semibold text-foreground">
            juri<span className="text-primary">@</span>security
          </span>
        </div>
        <a
          href="https://github.com/JuriBuora/JuriBuora.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">Source</span>
        </a>
      </div>
    </header>
  );
};

export default BlogHeader;
