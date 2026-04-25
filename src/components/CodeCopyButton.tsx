import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CodeCopyButtonProps = {
  code: string;
};

const CodeCopyButton = ({ code }: CodeCopyButtonProps) => {
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

export default CodeCopyButton;
