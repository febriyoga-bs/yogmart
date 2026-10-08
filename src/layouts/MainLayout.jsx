import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useReducer, useState } from "react";

import { productAPI, categoryAPI } from "../api";

import { Navbar } from "../components/domain/Navbar";
import { useTheme } from "../contexts/ThemeContext";

import { productReducer, categoryReducer } from "../utils/reducers";
import {
  SEED_PRODUCTS,
  SEED_CATEGORIES,
} from "../utils/constants";

export default function MainLayout() {
  const { theme } = useTheme();

  const C = theme?.colors;

  // const [products, dispatch] = useReducer(productReducer, SEED_PRODUCTS);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories])

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
      }}
    >
      <Navbar />

      <main className="tk-main">
        <Outlet
          context={{
            products,
            loadProducts,
            categories,
            loadCategories
            // dispatch,
          }}
        />
      </main>

      <footer
        className="tk-hide-mobile"
        style={{
          color: C.textMuted,
          fontSize: 13,
          marginTop: 48,
          padding: 24,
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
        }}
      >
        © 2026 Warung Yoga · Katalog Digital
      </footer>
    </div>
  );
}