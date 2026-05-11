import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Building2,
  Bell,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

function SettingsPage() {
  const { user, logout, projects } = useAppContext();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    activity: true,
    updates: true,
  });

  const fullName = user?.fullName ?? user?.fullname;

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.charAt(0).toUpperCase() ?? "U");

  const accountFields = [
    { label: "Full Name", value: fullName, icon: User },
    { label: "Email Address", value: user?.email, icon: Mail },
    { label: "School Name", value: user?.schoolName, icon: Building2 },
  ];

  const notificationItems = [
    {
      key: "email",
      label: "Email Notifications",
      desc: "Receive updates via email",
    },
    { key: "push", label: "Push Notifications", desc: "Browser push alerts" },
    {
      key: "activity",
      label: "Activity Alerts",
      desc: "Team activity on your projects",
    },
    {
      key: "updates",
      label: "Product Updates",
      desc: "New features and improvements",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-linear-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl p-6 md:p-8 shadow-xl mb-6 text-white"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="size-20 md:size-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-bold text-white border-2 border-white/30 shrink-0">
            {initials}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl md:text-2xl font-bold">{fullName || "—"}</h2>
            <p className="text-purple-200 text-sm mt-1">{user?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">
                Administrator
              </span>
              <span className="px-3 py-1 bg-green-400/30 rounded-full text-xs font-medium text-green-100">
                ● Active
              </span>
            </div>
          </div>

          <div className="text-center shrink-0">
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-purple-200 text-xs mt-1">Projects</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Account information — read only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-linear-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Account Information</h3>
              <p className="text-xs text-gray-500">
                Your registered account details
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {accountFields.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="size-8 bg-linear-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {value || (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <Shield className="size-4 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-600">
              Account details are managed by your administrator.
            </p>
          </div> */}
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Bell className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">
                Control what alerts you receive
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {notificationItems.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                    notifications[key]
                      ? "bg-linear-to-r from-purple-600 to-blue-600"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform ${
                      notifications[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 bg-linear-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center">
              <LogOut className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Session</h3>
              <p className="text-xs text-gray-500">
                Manage your active session
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-50 border border-red-100 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Sign out of SchoolBuilder
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                You'll need to log in again to access your projects.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-sm cursor-pointer shrink-0"
            >
              <LogOut className="size-4" />
              Sign Out
              <ChevronRight className="size-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPage;
