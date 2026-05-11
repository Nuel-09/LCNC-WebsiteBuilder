import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Globe,
  Settings,
  Users,
  Bell,
  Sparkles,
  Wifi,
  WifiOff,
  Layout,
  Palette,
  Menu,
  X,
  LogOut,
  User,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import navLinks from "../assets/navLink.json";
import { School } from "@/assets/svg/commonSvg";

const iconMap = {
  LayoutDashboard,
  Globe,
  Layout,
  Palette,
  Users,
  BarChart3,
  Settings,
};

function navClass({ isActive }) {
  return `w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
    isActive
      ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg"
      : "text-gray-700 hover:bg-gray-100"
  }`;
}

// function ProtectedLayout() {
//   const { user, logout } = useAppContext();

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b bg-card">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
//           <div>
//             <h1 className="text-lg font-semibold">LCNC Website Builder</h1>
//           </div>

//           <nav className="flex items-center gap-2">
//             <NavLink to="/dashboard" className={navClass}>
//               Dashboard
//             </NavLink>
//             <NavLink to="/builder" className={navClass}>
//               Builder
//             </NavLink>
//             <NavLink to="/settings" className={navClass}>
//               Settings
//             </NavLink>
//           </nav>

//           <div className="flex items-center gap-3">
//             <p className="hidden text-sm text-muted-foreground md:block">
//               {user?.email}
//             </p>
//             <button
//               type="button"
//               className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
//               onClick={logout}
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-7xl px-4 py-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

function ProtectedLayout() {
  const navigate = useNavigate();
  const { user, logout, projects } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div className="flex">
        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 shadow-xl z-40 overflow-y-auto",
            !sidebarOpen ? "hidden" : "flex",
          )}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 w-full">
                <div className="size-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center p-2">
                  <School className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">SchoolBuilder</h2>
                  <p className="text-xs text-gray-500">Queen's College</p>
                </div>
                <div className="w-full flex justify-end">
                  <X
                    onClick={() => setSidebarOpen(false)}
                    className="size-8 p-1 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                  />
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {navLinks.map((item) => {
                const Icon = iconMap[item.iconName];
                return (
                  <NavLink
                    key={item.label}
                    to={`/${item.view}`}
                    className={navClass}
                    onClick={closeSidebarOnMobile}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="size-5" />}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.badge === "New"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.view === "projects"
                          ? projects.length
                          : item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-8 p-4 bg-linear-to-br from-purple-100 to-blue-100 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Need help building your site? Ask me anything!
              </p>
              <button className="w-full py-2 bg-white text-purple-600 rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2">
                <Sparkles className="size-4" />
                Ask AI
              </button>
            </div>

            <div className="mt-6 p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Connection Status</span>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 ${
                    isOnline
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {isOnline ? (
                    <Wifi className="size-3" />
                  ) : (
                    <WifiOff className="size-3" />
                  )}
                  {isOnline ? "Online" : "Offline Mode"}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {isOnline
                  ? "All features available"
                  : "Working offline - changes will sync"}
              </p>
            </div>
          </div>
        </motion.aside>
        <main
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "ml-0"}`}
        >
          <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={cn(
                    "p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer",
                    sidebarOpen && "md:hidden",
                  )}
                >
                  <Menu className="size-6" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                    Welcome back to SchoolBuilder
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <Bell className="size-5 md:size-6 text-gray-700" />
                  <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative  md:flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullname}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="size-8 md:size-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute right-0 top-14 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 min-w-50 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.fullname}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate("/settings");
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600 cursor-pointer"
                        >
                          <User className="size-4" />
                          <span className="text-sm font-medium">
                            My Profile
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate("/settings");
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700 hover:text-purple-600 cursor-pointer"
                        >
                          <Settings className="size-4" />
                          <span className="text-sm font-medium">Settings</span>
                        </button>
                        <div className="my-1 border-t border-gray-200"></div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          <LogOut className="size-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ProtectedLayout;
