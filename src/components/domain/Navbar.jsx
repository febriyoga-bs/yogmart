import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NAV_ITEMS, APP_NAME } from "../../utils/constants";

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
    <nav
      style={{
        background: C.bgCard,
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: `0 1px 12px rgba(0,0,0,${
          theme.name === "dark" ? 0.4 : 0.05
        })`,
      }}
    >
      <div
        style={{
          maxWidth: "100vw",
          margin: "0 auto",
          padding: "0 24px",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          height: 64,
          gap: 16,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginRight: "auto",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: C.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src="/image/icon.png" width={50} height={50} alt="Logo" />
          </div>

          <div
            style={{
              fontWeight: 800,
              fontSize: 15,
              color: C.primary,
              lineHeight: 1.1,
            }}
          >
            {APP_NAME}
            <div
              style={{
                fontSize: 11,
                color: C.textMuted,
                fontWeight: 500,
              }}
            >
              Katalog Digital
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: 4,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 9,
                textDecoration: "none",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 14,
                transition: "all .2s",

                background: isActive ? C.primary : "transparent",
                color: isActive ? "#fff" : C.textMuted,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <ThemeSwitcher />

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, whiteSpace: "nowrap" }}>
              👤 {user.name}
            </span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Keluar
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}