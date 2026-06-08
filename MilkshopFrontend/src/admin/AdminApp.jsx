import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const LeadsPage = lazy(() => import("./pages/LeadsPage"));
const QrAndEmail = lazy(() => import("./pages/QrAndEmail"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const LeadDetails = lazy(() => import("./pages/LeadDetails"));

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="login" element={<AdminLogin />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="leads"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <LeadsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="qr-email"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <QrAndEmail />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="account-settings"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AccountSettings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="leads/:id"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <LeadDetails />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}
