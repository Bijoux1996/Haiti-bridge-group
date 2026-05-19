import { SharedLayout } from "../components/SharedLayout";
import { AgentRoute } from "../components/ProtectedRoute";

// SharedLayout first wraps AgentRoute, which then wraps the dashboard page
export default [SharedLayout, AgentRoute];