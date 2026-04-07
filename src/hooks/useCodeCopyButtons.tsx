import { useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { createRoot } from "react-dom/client";
import { useState } from "react";

const CopyBtn = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-secondary/80 border border-border text-muted-foreground hover:text-primary hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      aria-label="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

const useCodeCopyButtons = (contentReady: boolean) => {
  useEffect(() => {
    if (!contentReady) return;

    const timer = setTimeout(() => {
      const container = document.querySelector("div.prose");
      if (!container) return;

      container.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".copy-btn-root")) return;
        pre.classList.add("group", "relative");

        const wrapper = document.createElement("span");
        wrapper.className = "copy-btn-root";
        pre.appendChild(wrapper);

        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        createRoot(wrapper).render(<CopyBtn code={code} />);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [contentReady]);
};

export default useCodeCopyButtons;
