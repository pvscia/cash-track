import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
      {name:"Dashboard", path: "/dashboard",  },
      {name:"Wallets", path: "/wallets",  },
      {name:"Categories", path: "/categories",  },
      {name:"Targets", path: "/targets",  },
      {name:"Profile", path: "/profile",  },
    ];

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-4">

      <h2 className="text-2xl font-bold mb-6">Cash Track</h2>

      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition
                ${
                  pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-slate-700"
                }
              `}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
}
