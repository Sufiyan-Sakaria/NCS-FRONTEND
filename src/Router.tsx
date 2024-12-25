import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UsesrPage";
import AddUserPage from "./pages/AddUserPage";
import EdituserPage from "./pages/EditUserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "users/add",
        element: <AddUserPage />,
      },
      {
        path: "users/edit/:id",
        element: <EdituserPage />,
      },
    ],
  },
]);

export default router;
