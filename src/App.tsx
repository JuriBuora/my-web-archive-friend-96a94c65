import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = lazy(() => import("./pages/Index.tsx"));
const PostPage = lazy(() => import("./pages/PostPage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const App = () => (
  <ThemeProvider>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-sm">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/:collection" element={<CategoryPage />} />
            <Route path="/:category/:day" element={<PostPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
