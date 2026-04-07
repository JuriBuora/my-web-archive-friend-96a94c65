import BlogHeader from "@/components/BlogHeader";
import BlogFooter from "@/components/BlogFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { Shield, Target, BookOpen, Terminal, Award, ExternalLink, Download } from "lucide-react";

const skills = [
  { category: "Networking", items: ["TCP/IP", "DNS", "HTTP/S", "Wireshark", "Nmap"] },
  { category: "Operating Systems", items: ["Linux (CLI)", "Windows Security", "File Systems"] },
  { category: "Security Concepts", items: ["Phishing Analysis", "Malware Families", "LOLBins", "APT Groups", "Email Security"] },
  { category: "Tools & Platforms", items: ["TryHackMe", "GitHub", "Burp Suite", "SIEM Basics"] },
  { category: "Programming", items: ["Python", "JavaScript", "Bash Scripting"] },
  { category: "Documentation", items: ["Technical Writing", "Incident Reports", "Structured Logging"] },
];

const certifications = [
  { name: "CompTIA Security+", status: "In Progress", icon: "🎯" },
  { name: "TryHackMe Learning Paths", status: "Active", icon: "🔬" },
  { name: "Google Cybersecurity Certificate", status: "Planned", icon: "📋" },
];

const milestones = [
  { number: "59", label: "Days Logged" },
  { number: "4", label: "Labs Completed" },
  { number: "100", label: "Day Goal" },
  { number: "59%", label: "Progress" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <BlogHeader />

      {/* Hero */}
      <section className="relative border-b border-border bg-card">
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Juri Buora
          </h1>
          <p className="font-mono text-sm text-primary mb-4">
            Aspiring Cybersecurity Professional
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            I'm documenting my journey from zero to cybersecurity — building real skills through daily study,
            hands-on labs, and honest documentation. My goal is to become a junior security analyst,
            with a solid foundation in networking, Linux, web security, and threat analysis.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {milestones.map((m) => (
              <div key={m.label} className="text-center p-4 rounded-lg border border-border bg-card">
                <p className="text-2xl font-bold text-primary font-mono">{m.number}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h2 className="font-mono text-xs text-primary uppercase tracking-widest mb-6">
            My Approach
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-5 bg-card">
              <Target className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-card-foreground mb-1">Foundations First</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Solid understanding of networking, operating systems, and web technologies before jumping into offensive security.
              </p>
            </div>
            <div className="border border-border rounded-lg p-5 bg-card">
              <Terminal className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-card-foreground mb-1">Hands-On Labs</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every concept gets tested in practice — TryHackMe rooms, custom scripts, and documented exercises.
              </p>
            </div>
            <div className="border border-border rounded-lg p-5 bg-card">
              <BookOpen className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-card-foreground mb-1">Public Documentation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Everything is logged publicly — mistakes included. Transparency builds trust and accelerates learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h2 className="font-mono text-xs text-primary uppercase tracking-widest mb-6">
            Skills & Tools
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {skills.map((group) => (
              <div key={group.category} className="border border-border rounded-lg p-5 bg-card">
                <h3 className="text-sm font-semibold text-card-foreground mb-3">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h2 className="font-mono text-xs text-primary uppercase tracking-widest mb-6">
            Certifications & Learning
          </h2>
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-4 border border-border rounded-lg p-4 bg-card"
              >
                <span className="text-2xl">{cert.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">{cert.status}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono ${
                    cert.status === "Active"
                      ? "bg-primary/10 text-primary"
                      : cert.status === "In Progress"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {cert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">Interested in connecting?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            I'm actively looking for junior cybersecurity roles — SOC analyst, security operations, or penetration testing internships.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:juribuora@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get in Touch
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/juri-buora/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              LinkedIn Profile
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <BlogFooter />
    </div>
  );
};

export default AboutPage;
