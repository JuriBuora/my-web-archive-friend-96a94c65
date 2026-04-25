import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import CodeCopyButton from "@/components/CodeCopyButton";

const useCodeCopyButtons = (contentReady: boolean) => {
  useEffect(() => {
    if (!contentReady) return;

    const roots: Root[] = [];
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
        const root = createRoot(wrapper);
        roots.push(root);
        root.render(<CodeCopyButton code={code} />);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      roots.forEach((root) => root.unmount());
    };
  }, [contentReady]);
};

export default useCodeCopyButtons;
