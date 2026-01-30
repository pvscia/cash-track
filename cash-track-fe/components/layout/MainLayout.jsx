import React from "react";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div className="flex-1 p-6 text-white">
        {children}
      </div>

    </div>
  );
}
