import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";

import MainLayout from "./layouts/MainLayout";

import { CatalogPage } from "./pages/CatalogPage";
import { ScannerPage } from "./pages/ScannerPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #88888840; border-radius: 99px; }
        input::placeholder { color: #a8a29e; }
        input[type=number]::-webkit-inner-spin-button { opacity: .4; }

        @keyframes tk-fadeIn  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0);  } }
        @keyframes tk-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tk-spin    { to   { transform: rotate(360deg); } }
        @keyframes tk-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes tk-scanLine { 0%, 100% { top: 10px; } 50% { top: calc(100% - 12px); } }
      `}</style>
      </ToastProvider>
    </ThemeProvider>
  );
}