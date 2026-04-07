export type Post = {
  day: number;
  title: string;
  date: string;
  url: string;
  category: "blog" | "lab";
  tags: string[];
};

export const posts: Post[] = [
  { day: 59, title: "Studying Malware Families: TrickBot, WannaMine and Cryptomining Threats", date: "2026-03-31", url: "https://juribuora.github.io/blog/2026/03/31/day-59.html", category: "blog", tags: ["malware", "threat-intel"] },
  { day: 58, title: "DLL Files, Code Signing, and Malware Trust Verification", date: "2026-03-30", url: "https://juribuora.github.io/blog/2026/03/30/day-58.html", category: "blog", tags: ["malware", "windows"] },
  { day: 57, title: "LOLBins Deep Dive: Squiblydoo (rundll32 and mshtml Abuse)", date: "2026-03-29", url: "https://juribuora.github.io/blog/2026/03/29/day-57.html", category: "blog", tags: ["lolbins", "windows"] },
  { day: 56, title: "Offensive Security Frameworks and LOLBins", date: "2026-03-28", url: "https://juribuora.github.io/blog/2026/03/28/day-56.html", category: "blog", tags: ["offensive", "frameworks"] },
  { day: 55, title: "Typosquatting and Malicious Domain Impersonation", date: "2026-03-27", url: "https://juribuora.github.io/blog/2026/03/27/day-55.html", category: "blog", tags: ["phishing", "domains"] },
  { day: 54, title: "Investigating Phishing Through Email Gateway Logs", date: "2026-03-26", url: "https://juribuora.github.io/blog/2026/03/26/day-54.html", category: "blog", tags: ["phishing", "logs"] },
  { day: 53, title: "Understanding Phishing Attacks and Email Security Layers", date: "2026-03-25", url: "https://juribuora.github.io/blog/2026/03/25/day-53.html", category: "blog", tags: ["phishing", "email"] },
  { day: 52, title: "First Steps with Python and JavaScript for Security", date: "2026-03-24", url: "https://juribuora.github.io/blog/2026/03/24/day-52.html", category: "blog", tags: ["python", "scripting"] },
  { day: 51, title: "CLI Fundamentals, OS Security, and Understanding How Data is Represented", date: "2026-03-23", url: "https://juribuora.github.io/blog/2026/03/23/day-51.html", category: "blog", tags: ["cli", "fundamentals"] },
  { day: 50, title: "Understanding Advanced Persistent Threat (APT) Groups", date: "2026-03-22", url: "https://juribuora.github.io/blog/2026/03/22/day-50.html", category: "blog", tags: ["apt", "threat-intel"] },
  { day: 49, title: "Investigating Phishing Infrastructure and Email Attacks", date: "2026-03-21", url: "https://juribuora.github.io/blog/2026/03/21/day-49.html", category: "blog", tags: ["phishing", "investigation"] },
  { day: 48, title: "Detecting Authentication Attacks in System Logs", date: "2026-03-20", url: "https://juribuora.github.io/blog/2026/03/20/day-48.html", category: "blog", tags: ["detection", "logs"] },
  { day: 47, title: "Encoded PowerShell and Obfuscated Command Execution", date: "2026-03-19", url: "https://juribuora.github.io/blog/2026/03/19/day-47.html", category: "blog", tags: ["powershell", "obfuscation"] },
  { day: 46, title: "Understanding LOLBins and Living-off-the-Land Attacks", date: "2026-03-18", url: "https://juribuora.github.io/blog/2026/03/18/day-46.html", category: "blog", tags: ["lolbins", "attacks"] },
  { day: 45, title: "Pivot Training for Log Investigation", date: "2026-03-17", url: "https://juribuora.github.io/blog/2026/03/17/day-45.html", category: "blog", tags: ["soc", "logs"] },
  { day: 44, title: "Detecting Beaconing and Command-and-Control Traffic", date: "2026-03-16", url: "https://juribuora.github.io/blog/2026/03/16/day-44.html", category: "blog", tags: ["c2", "detection"] },
  { day: 43, title: "Detecting Suspicious Process Chains", date: "2026-03-15", url: "https://juribuora.github.io/blog/2026/03/15/day-43.html", category: "blog", tags: ["detection", "processes"] },
  { day: 42, title: "SOC Thinking: Turning Logs into Evidence", date: "2026-03-14", url: "https://juribuora.github.io/blog/2026/03/14/day-42.html", category: "blog", tags: ["soc", "analysis"] },
  { day: 41, title: "Sysmon Telemetry, Lab Automation, and Full Cyber Lab Architecture", date: "2026-03-13", url: "https://juribuora.github.io/blog/2026/03/13/day-41.html", category: "blog", tags: ["sysmon", "lab"] },
  { day: 40, title: "Building a Reproducible Windows SOC VM and Lab Infrastructure", date: "2026-03-12", url: "https://juribuora.github.io/blog/2026/03/12/day-40.html", category: "blog", tags: ["lab", "windows"] },
  { day: 39, title: "Building a Portable Zsh Environment with GitHub Dotfiles", date: "2026-03-11", url: "https://juribuora.github.io/blog/2026/03/11/day-39.html", category: "blog", tags: ["linux", "tooling"] },
  { day: 38, title: "SSH Brute-Force Investigation and Automated Defense", date: "2026-03-10", url: "https://juribuora.github.io/blog/2026/03/10/day-38.html", category: "blog", tags: ["ssh", "defense"] },
  { day: 37, title: "Ports, Services, and Investigating Listening Processes", date: "2026-03-09", url: "https://juribuora.github.io/blog/2026/03/09/day-37.html", category: "blog", tags: ["networking", "processes"] },
  { day: 36, title: "Linux Process Investigation and First Log Exploration", date: "2026-03-07", url: "https://juribuora.github.io/blog/2026/03/07/day-36.html", category: "blog", tags: ["linux", "logs"] },
  { day: 35, title: "Linux Process Baselining with ps and top", date: "2026-03-05", url: "https://juribuora.github.io/blog/2026/03/05/day-35.html", category: "blog", tags: ["linux", "processes"] },
  { day: 34, title: "Networking Mental Model Reset (DNS, TCP/UDP, HTTPS/TLS, QUIC)", date: "2026-03-03", url: "https://juribuora.github.io/blog/2026/03/03/day-34.html", category: "blog", tags: ["networking", "protocols"] },
  { day: 33, title: "Expanding the SOC Learning Roadmap (Identity, Triage, and Hiring Readiness)", date: "2026-03-02", url: "https://juribuora.github.io/blog/2026/03/02/day-33.html", category: "blog", tags: ["soc", "career"] },
  { day: 32, title: "OSI Model, Encapsulation, and Core Network Protocols", date: "2026-03-01", url: "https://juribuora.github.io/blog/2026/03/01/day-32.html", category: "blog", tags: ["networking", "osi"] },
  { day: 31, title: "Regex Behavior and Text Processing Foundations", date: "2026-02-28", url: "https://juribuora.github.io/blog/2026/02/28/day-31.html", category: "blog", tags: ["regex", "linux"] },
  { day: 30, title: "Streams, Exit Codes, and Bash Redirection", date: "2026-02-27", url: "https://juribuora.github.io/blog/2026/02/27/day-30.html", category: "blog", tags: ["bash", "linux"] },
  { day: 29, title: "SOC Thinking with Linux Pipelines, Pivots, and Process Chains", date: "2026-02-26", url: "https://juribuora.github.io/blog/2026/02/26/day-29.html", category: "blog", tags: ["soc", "linux"] },
  { day: 28, title: "Understanding Command Resolution & Filesystem Investigation with find", date: "2026-02-25", url: "https://juribuora.github.io/blog/2026/02/25/day-28.html", category: "blog", tags: ["linux", "filesystem"] },
  { day: 27, title: "Command Resolution, PATH Internals & Shell Environment Investigation", date: "2026-02-24", url: "https://juribuora.github.io/blog/2026/02/24/day-27.html", category: "blog", tags: ["linux", "shell"] },
  { day: 26, title: "Effective Shell Part 2: Pipelines, Readline Search, Job Control", date: "2026-02-22", url: "https://juribuora.github.io/blog/2026/02/22/day-26.html", category: "blog", tags: ["shell", "linux"] },
  { day: 25, title: "Effective Shell Fundamentals: ls, du, man, Heredocs, Updates, and Docker Permissions", date: "2026-02-17", url: "https://juribuora.github.io/blog/2026/02/17/day-25.html", category: "blog", tags: ["shell", "docker"] },
  { day: 24, title: "Tools Lane Setup, Effective Shell, and Shutdown Triage", date: "2026-02-16", url: "https://juribuora.github.io/blog/2026/02/16/day-24.html", category: "blog", tags: ["tooling", "shell"] },
  { day: 23, title: "Consolidation, Repetition, and Anki-Driven Recall", date: "2026-02-14", url: "https://juribuora.github.io/blog/2026/02/14/day-23.html", category: "blog", tags: ["learning", "methodology"] },
  { day: 22, title: "stdout, stderr, wget, and Output Validation", date: "2026-02-13", url: "https://juribuora.github.io/blog/2026/02/13/day-22.html", category: "blog", tags: ["linux", "fundamentals"] },
  { day: 21, title: "Building My Detection Engineering Repo + Hardening My Blog Setup", date: "2026-02-12", url: "https://juribuora.github.io/blog/2026/02/12/day-21.html", category: "blog", tags: ["detection", "engineering"] },
  { day: 20, title: "Auditing a Media Archive and Taking Control of Backups", date: "2026-02-11", url: "https://juribuora.github.io/blog/2026/02/11/day-20.html", category: "blog", tags: ["audit", "backups"] },
  { day: 19, title: "Bare-Metal Dual Boot on Intel Mac (macOS + Ubuntu Server)", date: "2026-02-10", url: "https://juribuora.github.io/blog/2026/02/10/day-19.html", category: "blog", tags: ["linux", "lab"] },
  { day: 18, title: "Intel Mac Dual-Boot Experiments, Architecture Friction, and Lab Prep", date: "2026-02-09", url: "https://juribuora.github.io/blog/2026/02/09/day-18.html", category: "blog", tags: ["lab", "hardware"] },
  { day: 17, title: "Cookies, Sessions, and Trust Boundaries", date: "2026-02-08", url: "https://juribuora.github.io/blog/2026/02/08/day-17.html", category: "blog", tags: ["web", "security"] },
  { day: 16, title: "Linux Privilege Escalation: SUID, SGID, Sticky Bit (Foundations)", date: "2026-02-07", url: "https://juribuora.github.io/blog/2026/02/07/day-16.html", category: "blog", tags: ["linux", "privesc"] },
  { day: 15, title: "Building a Proper Terminal Logging Pipeline", date: "2026-02-06", url: "https://juribuora.github.io/blog/2026/02/06/day-15.html", category: "blog", tags: ["terminal", "logging"] },
  { day: 14, title: "Linux Permissions, Identity, Pipes, and Data Processing Fundamentals", date: "2026-02-05", url: "https://juribuora.github.io/blog/2026/02/05/day-14.html", category: "blog", tags: ["linux", "permissions"] },
  { day: 13, title: "SSH and Networking Flow Between VMs", date: "2026-02-04", url: "https://juribuora.github.io/blog/2026/02/04/day-13.html", category: "blog", tags: ["ssh", "networking"] },
  { day: 12, title: "Linux Files, Permissions, and Safety", date: "2026-02-02", url: "https://juribuora.github.io/blog/2026/02/02/day-12.html", category: "blog", tags: ["linux", "permissions"] },
  { day: 11, title: "Linux Fundamentals Part 3 (Finale)", date: "2026-01-31", url: "https://juribuora.github.io/blog/2026/01/31/day-11.html", category: "blog", tags: ["linux", "fundamentals"] },
  { day: 10, title: "Linux Fundamentals Part 2 (SSH, Filesystem, Permissions)", date: "2026-01-30", url: "https://juribuora.github.io/blog/2026/01/30/day-10.html", category: "blog", tags: ["linux", "ssh"] },
  { day: 9, title: "Linux Fundamentals Part 1", date: "2026-01-27", url: "https://juribuora.github.io/blog/2026/01/27/day-09.html", category: "blog", tags: ["linux", "fundamentals"] },
  { day: 8, title: "Killing Minima Ghosts & Owning the Stack", date: "2026-01-26", url: "https://juribuora.github.io/blog/2026/01/26/day-08.html", category: "blog", tags: ["jekyll", "setup"] },
  { day: 7, title: "Workflow Ergonomics & GitHub Pages Stabilization", date: "2026-01-25", url: "https://juribuora.github.io/blog/2026/01/25/day-07.html", category: "blog", tags: ["workflow", "github"] },
  { day: 6, title: "Polishing Website & Fixing Jekyll Environment", date: "2026-01-24", url: "https://juribuora.github.io/blog/2026/01/24/day-06.html", category: "blog", tags: ["jekyll", "setup"] },
  { day: 5, title: "Blogging with GitHub Pages (Publishing Foundations)", date: "2026-01-23", url: "https://juribuora.github.io/blog/2026/01/23/day-05.html", category: "blog", tags: ["github", "publishing"] },
  { day: 4, title: "No Progress (Logged Honestly)", date: "2026-01-22", url: "https://juribuora.github.io/blog/2026/01/22/day-04.html", category: "blog", tags: ["honesty", "reflection"] },
  { day: 3, title: "How Websites Work (Big Picture)", date: "2026-01-21", url: "https://juribuora.github.io/blog/2026/01/21/day-03.html", category: "blog", tags: ["web", "fundamentals"] },
  { day: 2, title: "Networking & Web Fundamentals (Consolidation Day)", date: "2026-01-20", url: "https://juribuora.github.io/blog/2026/01/20/day-02.html", category: "blog", tags: ["networking", "web"] },
  { day: 1, title: "Environment Setup & Foundations", date: "2026-01-19", url: "https://juribuora.github.io/blog/2026/01/19/day-01.html", category: "blog", tags: ["setup", "foundations"] },
];

export const labs: Post[] = [
  { day: 4, title: "Endpoint Process Chain Triage with Pipe-Delimited Logs and awk", date: "2026-02-26", url: "https://juribuora.github.io/labs/2026/02/26/lab-04-day-29.html", category: "lab", tags: ["soc", "awk"] },
  { day: 3, title: "HTTP in Practice (Pentester POV)", date: "2026-02-08", url: "https://juribuora.github.io/labs/2026/02/08/lab-03-day-17.html", category: "lab", tags: ["http", "pentesting"] },
  { day: 2, title: "Real SUID Behavior: Scripts vs Binaries", date: "2026-02-07", url: "https://juribuora.github.io/labs/2026/02/07/lab-02-day-16.html", category: "lab", tags: ["linux", "suid"] },
  { day: 1, title: "Linux Permissions & Ownership Hands-On Practice", date: "2026-02-05", url: "https://juribuora.github.io/labs/2026/02/05/lab-01_day-14.html", category: "lab", tags: ["linux", "permissions"] },
];

export const allTags = Array.from(
  new Set([...posts, ...labs].flatMap((p) => p.tags))
).sort();
