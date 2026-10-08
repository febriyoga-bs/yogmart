import { NavLink, useNavigate } from "react-router-dom";
import { Store, ScanLine, LayoutDashboard, LogOut } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NAV_ITEMS, APP_NAME } from "../../utils/constants";

const NAV_ICONS = { catalog: Store, scan: ScanLine, admin: LayoutDashboard };

/**
 * Header atas (semua ukuran) + bottom navigation (mobile)
 */
export function Navbar() {
  const { theme } = useTheme();
  const C = theme.colors;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: `${C.bgCard}e6`,
          backdropFilter: "saturate(180%) blur(14px)",
          WebkitBackdropFilter: "saturate(180%) blur(14px)",
          borderBottom: `1px solid ${C.border}`,
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div className="tk-container" style={{ display: "flex", alignItems: "center", gap: 12, height: 60 }}>
          {/* Logo */}
          <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto", textDecoration: "none", minWidth: 0 }}>
            <img src="/icon.svg" width={36} height={36} alt="" style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.text, lineHeight: 1.15, whiteSpace: "nowrap" }}>{APP_NAME}</div>
              <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>Katalog Digital</div>
            </div>
          </NavLink>

          {/* Desktop navigation */}
          <nav className="tk-hide-mobile" style={{ display: "flex", gap: 2, background: C.bgMuted, borderRadius: 12, padding: 3 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = NAV_ICONS[item.id];
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/"}
                  style={({ isActive }) => ({
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "8px 14px", borderRadius: 9,
                    textDecoration: "none", fontWeight: 700, fontSize: 14,
                    transition: "all .2s",
                    background: isActive ? C.bgCard : "transparent",
                    color: isActive ? C.primary : C.textMuted,
                    boxShadow: isActive ? C.shadow : "none",
                  })}
                >
                  {Icon && <Icon size={17} strokeWidth={2.2} />}
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="tk-hide-mobile"><ThemeSwitcher /></div>
          <div className="tk-show-mobile"><ThemeSwitcher compact /></div>

          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                title={user.name}
                style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: C.primary, color: "#fff", fontWeight: 800, fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                aria-label="Keluar"
                title="Keluar"
                style={{
                  width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`,
                  background: "transparent", color: C.textMuted, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <LogOut size={17} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="tk-show-mobile"
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
          background: `${C.bgCard}f2`,
          backdropFilter: "saturate(180%) blur(14px)",
          WebkitBackdropFilter: "saturate(180%) blur(14px)",
          borderTop: `1px solid ${C.border}`,
          paddingBottom: "env(safe-area-inset-bottom)",
          display: "flex",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.id];
          const isScan = item.id === "scan";
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                flex: 1, height: 64,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                textDecoration: "none", fontSize: 11, fontWeight: 700,
                color: isActive ? C.primary : C.textMuted,
              })}
            >
              {({ isActive }) => (
                <>
                  {isScan ? (
                    // Tombol scan menonjol di tengah
                    <span
                      style={{
                        width: 52, height: 52, marginTop: -26, borderRadius: 18,
                        background: C.heroGrad, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 8px 20px ${C.primary}55`,
                        border: `3px solid ${C.bgCard}`,
                      }}
                    >
                      <Icon size={24} strokeWidth={2.4} />
                    </span>
                  ) : (
                    <span
                      style={{
                        padding: "4px 16px", borderRadius: 99,
                        background: isActive ? C.primaryAlpha : "transparent",
                        display: "flex", transition: "background .2s",
                      }}
                    >
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    </span>
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
