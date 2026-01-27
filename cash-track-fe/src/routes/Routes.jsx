import LazyLoadRoutes from "./LazyLoadRoutes";

export const authRoutes = [
  { path: "/categories", element: LazyLoadRoutes(import("../pages/categories/Category")) },
  { path: "/dashboard", element: LazyLoadRoutes(import("../pages/dashboard/Dashboard")) },
  { path: "/profile", element: LazyLoadRoutes(import("../pages/profile/Profile")) },
  { path: "/targets", element: LazyLoadRoutes(import("../pages/targets/Target")) },
  { path: "/wallets", element: LazyLoadRoutes(import("../pages/wallets/Wallet")) },
];

export const publicRoutes = [
  { path: "/login", element: LazyLoadRoutes(import("../pages/auth/Login")) },
  { path: "/register", element: LazyLoadRoutes(import("../pages/auth/Register")) },
  { path: "/forgot-password", element: LazyLoadRoutes(import("../pages/auth/ForgotPassword")) },
];
