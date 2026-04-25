import { Shield, Github, Linkedin, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  { href: "https://www.linkedin.com/in/juri-buora/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://www.facebook.com/Juri.Buora", icon: Facebook, label: "Facebook" },
  { href: "https://x.com/JBuora", icon: Twitter, label: "Twitter/X" },
  { href: "https://github.com/JuriBuora", icon: Github, label: "GitHub" },
  { href: "mailto:juribuora@gmail.com", icon: Mail, label: "Email" },
];

const BlogFooter = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm font-semibold text-foreground">
              juri<span className="text-primary">@</span>security
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-muted-foreground text-center max-w-md">
            Documenting the journey from zero to cybersecurity — one day at a time.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Nav */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/labs" className="text-muted-foreground hover:text-primary transition-colors">
              Labs
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <a
              href="https://github.com/JuriBuora/JuriBuora.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Source
            </a>
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Juri Buora · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
