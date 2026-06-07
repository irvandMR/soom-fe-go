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

function App() {
  const { accessToken, setAuth } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!accessToken) {
        setChecking(false);
        return;
      }
      try {
        // Cek apakah token masih valid dengan hit /auth/me
        const res = await authService.me();
        setAuth(accessToken, {
          id: "",
          username: res.data.result.username,
          email: "",
          role: "",
        }); // TODO: set user sebenarnya;
      } catch {
        // Token expired dan refresh gagal → sudah di-handle interceptor
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

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
          {/* {/* <Route path={ROUTES.ORDERS} element={<OrderPage />} /> */}
          {/* <Route path={ROUTES.INGREDIENTS} element={<IngredientPage />} /> */}
          {/* <Route path={ROUTES.PRODUCTS} element={<ProductPage />} /> */}
          {/* <Route path={ROUTES.PRODUCTIONS} element={<ProductionPage />} /> */}
          {/* <Route path={ROUTES.CASH_FLOW} element={<CashFlowPage />} /> */}
          {/* <Route
					path={ROUTES.PRODUCT_RECIPE_HISTORY}
					element={<ProductRecipeHistoryPage />}
				/> */}
          <Route path={ROUTES.UNITS} element={<UnitPage />} />
          {/* <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} /> */}
          {/* <Route path={ROUTES.USERS} element={<UserManagementPage />} /> */}
          <Route path={ROUTES.DOCS} element={<DocumentationPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
