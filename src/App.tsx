import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/common/AppLayout";
import { ROUTES } from "./constant/routes";
import DocumentationPage from "./pages/DocumentationPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import { authService } from "./service/auth.service";
import UnitPage from "./pages/UnitPage";
import CategoriPage from "./pages/CategoriPage";
import Ingredientpage from "./pages/IngredientPage";
import ProductPage from "./pages/ProductPage";
import ProductionPage from "./pages/ProductionPage";
import CashFlowPage from "./pages/CashFlowPage";
import UserManagementPage from "./pages/UserManagementPage";
import TenantManagementPage from "./pages/TenantManagementPage";
import ProfilePage from "./pages/ProfilePage";
import OrderPage from "./pages/OrderPage";

import { useActiveTenantStore } from "./store/useActiveTenantStore";

const DUMMY_EMAIL_TENANT_MAP: Record<string, string> = {
  "irvandi@soom.com": "ten-1",
  "budi.kasir@soom.com": "ten-1",
  "siti.staff@soom.com": "ten-2",
  "andi@soom.com": "ten-3",
};

function App() {
  const { accessToken, setAuth, clearAuth, user } = useAuthStore();
  const { setActiveTenantId } = useActiveTenantStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!accessToken) {
        setChecking(false);
        return;
      }
      try {
        const res = await authService.me();
        const result = res.data.result;
        const email = result.email || "";
        const role = result.role || "user";
        const tenantId = DUMMY_EMAIL_TENANT_MAP[email] || result.tenantId || result.tenant_id || "ten-1";

        setAuth(accessToken, {
          id: result.id || "",
          username: result.username,
          email,
          role,
          tenantId,
        });
      } catch {
        clearAuth();
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (user && user.role !== "superadmin" && user.tenantId) {
      setActiveTenantId(user.tenantId);
    }
  }, [user, setActiveTenantId]);

  if (checking)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--content-bg)",
        }}
      >
        <i
          className="pi pi-spin pi-spinner"
          style={{ fontSize: 28, color: "var(--accent)" }}
        />
      </div>
    );

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ORDERS} element={<OrderPage />} />
          <Route path={ROUTES.INGREDIENTS} element={<Ingredientpage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductPage />} />
          <Route path={ROUTES.PRODUCTIONS} element={<ProductionPage />} />
          <Route path={ROUTES.CASH_FLOW} element={<CashFlowPage />} />
          <Route path={ROUTES.UNITS} element={<UnitPage />} />
          <Route path={ROUTES.CATEGORIES} element={<CategoriPage />} />
          <Route path={ROUTES.USERS} element={<UserManagementPage />} />
          <Route path={ROUTES.TENANT} element={<TenantManagementPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage defaultTab="profile" />} />
          <Route path={ROUTES.CHANGE_PASSWORD} element={<ProfilePage defaultTab="password" />} />
          <Route path={ROUTES.DOCS} element={<DocumentationPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
