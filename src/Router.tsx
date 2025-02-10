import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UsesrPage";
import AddUserPage from "./pages/AddUserPage";
import EdituserPage from "./pages/EditUserPage";
import BrandsPage from "./pages/BrandsPage";
import AddBrandPage from "./pages/AddBrandPage";
import EditBrandPage from "./pages/EditBrandPage";
import CategoryPage from "./pages/CategoryPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import AddCategoryPage from "./pages/AddCategoryPage";
import AccountsPage from "./pages/AccountsPage";
import VoucherPage from "./pages/VoucherPage";
import RecieptVoucherPage from "./pages/RecieptVoucherPage";

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
      {
        path: "brands",
        element: <BrandsPage />,
      },
      {
        path: "brands/add",
        element: <AddBrandPage />,
      },
      {
        path: "brands/edit/:id",
        element: <EditBrandPage />,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
      {
        path: "categories/add",
        element: <AddCategoryPage />,
      },
      {
        path: "Categories/edit/:id",
        element: <EditCategoryPage />,
      },
      {
        path: "Accounts",
        element: <AccountsPage />,
      },
      {
        path: "Vouchers",
        element: <VoucherPage />,
      },
      {
        path: "Vouchers/receipt",
        element: <RecieptVoucherPage />,
      },
    ],
  },
]);

export default router;
