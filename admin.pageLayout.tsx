import { SharedLayout } from "../components/SharedLayout";
import { AdminRoute } from "../components/ProtectedRoute";

// Protect the entire admin dashboard with AdminRoute and apply SharedLayout
export default [SharedLayout, AdminRoute];