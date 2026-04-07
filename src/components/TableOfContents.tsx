import { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentReady: boolean;
}

const TableOfContents = ({ contentReady }: TableOfContentsProps) => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!contentReady) return;

    const timer = setTimeout(() => {
      const container = document.querySelector("div.prose");
      if (!container) return;

      const headings = container.querySelectorAll("h1, h2, h3, h4");
      const tocItems: TocItem[] = [];

      headings.forEach((el, i) => {
        if (!el.id) {
          el.id = `heading-${i}`;
        }
        tocItems.push({
          id: el.id,
          text: el.textContent || "",
          level: parseInt(el.tagName[1]),
        });
      });

      setItems(tocItems);
    }, 100);

    return () => clearTimeout(timer);
  }, [contentReady]);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
        aria-label="Table of contents"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <nav
            className="absolute right-0 top-0 h-full w-64 bg-card border-l border-border p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <TocList items={items} activeId={activeId} onClickItem={() => setOpen(false)} />
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden lg:block sticky top-24 w-56 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <TocList items={items} activeId={activeId} />
      </nav>
    </>
  );
};

const TocList = ({
  items,
  activeId,
  onClickItem,
}: {
  items: TocItem[];
  activeId: string;
  onClickItem?: () => void;
}) => (
  <div>
    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
      On this page
    </p>
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onClickItem}
            className={cn(
              "block font-mono text-xs py-1 border-l-2 transition-colors",
              item.level === 1 && "pl-3",
              item.level === 2 && "pl-3",
              item.level === 3 && "pl-6",
              item.level === 4 && "pl-9",
              activeId === item.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <span className="line-clamp-2">{item.text}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default TableOfContents;
