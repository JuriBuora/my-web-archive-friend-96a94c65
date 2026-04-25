import { Shield, Github, Sun, Moon, Linkedin, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const BlogHeader = () => {
  const { theme, toggle } = useTheme();

  const socialLinks = [
    { href: "https://www.linkedin.com/in/juri-buora/", icon: Linkedin, label: "LinkedIn" },
    { href: "https://www.facebook.com/Juri.Buora", icon: Facebook, label: "Facebook" },
    { href: "https://x.com/JBuora", icon: Twitter, label: "Twitter/X" },
    { href: "https://github.com/JuriBuora", icon: Github, label: "GitHub" },
    { href: "mailto:juribuora@gmail.com", icon: Mail, label: "Email" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm font-semibold text-foreground">
            juri<span className="text-primary">@</span>security
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/about"
            className="px-2 py-1 rounded-md text-xs font-mono text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
          >
            About
          </Link>
          <button
            onClick={toggle}
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
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
      </div>
    </header>
  );
};

export default BlogHeader;
