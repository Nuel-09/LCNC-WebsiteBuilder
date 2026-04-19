import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="home" duration={500} smooth className="cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>{" "}
              <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SchoolBuilder AI
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="features"
              smooth
              duration={500}
              className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
            >
              Features
            </Link>

            <Link
              to="how-it-works"
              smooth
              duration={500}
              className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
            >
              How It Works
            </Link>

            <Link
              to="templates"
              smooth
              duration={500}
              className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer"
            >
              Templates
            </Link>
            <button
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg transition cursor-pointer hover:opacity-90"
              onClick={() => nav("/auth")}
            >
              Get Started
            </button>
            <button
              className="px-8 py-2 bg-transparent text-gray-800 rounded-lg border-2 border-gray-300 hover:border-purple-600 transition-colors cursor-pointer"
              onClick={() => nav("/auth")}
            >
              Login
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="features"
              smooth
              duration={500}
              className="block text-gray-700 hover:text-purple-600"
            >
              Features
            </Link>
            <Link
              to="how-it-works"
              smooth
              duration={500}
              className="block text-gray-700 hover:text-purple-600"
            >
              How It Works
            </Link>
            <Link
              to="templates"
              smooth
              duration={500}
              className="block text-gray-700 hover:text-purple-600"
            >
              Templates
            </Link>
            <button
              onClick={() => nav("/auth")}
              className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg"
            >
              Get Started
            </button>
            <button
              className="w-full px-6 py-2 bg-transparent text-gray-800 rounded-lg border-2 border-gray-300 "
              onClick={() => nav("/auth")}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
