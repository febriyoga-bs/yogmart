import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RequireAuth } from "./components/domain/RequireAuth";

import MainLayout from "./layouts/MainLayout";

import { CatalogPage } from "./pages/CatalogPage";
import { ScannerPage } from "./pages/ScannerPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />
            </Route>
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}