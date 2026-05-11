import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-scroll";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 bg-linear-to-br from-purple-600 to-blue-600 rounded-lg"></div>
              <span className="text-xl font-semibold text-white">
                SchoolBuilder AI
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering Nigerian schools with no-code website building tools
              and intelligent AI assistance.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="features"
                  smooth
                  duration={500}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="templates"
                  smooth
                  duration={500}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Templates
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-purple-400" />
                <span>support@schoolbuilder.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-purple-400" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-purple-400" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-400">
            © 2026 SchoolBuilder AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
