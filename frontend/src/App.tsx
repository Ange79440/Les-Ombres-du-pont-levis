import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Title from "@/pages/Title";
import Game from "@/pages/Game";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Title />} />
        <Route path="/jeu/:slot" element={<Game />} />
        <Route path="*" element={<Title />} />
      </Routes>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
