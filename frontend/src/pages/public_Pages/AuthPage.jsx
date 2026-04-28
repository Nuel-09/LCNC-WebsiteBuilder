import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  School,
  ArrowRight,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Chrome,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
function AuthPage() {
  const { token, authenticate, isLoading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    schoolName: "",
    email: "",
    password: "",
  });

  const handlePasswordChange = (value) => {
    setFormData({ ...formData, password: value });

    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const payload =
      activeTab === "signup"
        ? {
            email: formData.email,
            password: formData.password,
            fullName: formData.name,
            schoolName: formData.schoolName,
          }
        : { email: formData.email, password: formData.password };

    const success = await authenticate(activeTab, payload);

    if (success) {
      const destination = location.state?.from?.pathname ?? "/dashboard";
      navigate(destination, { replace: true });
    }
  }

  const isDisabled =
    activeTab === "signup"
      ? !formData.email ||
        !formData.password ||
        !formData.name ||
        !formData.schoolName
      : !formData.email || !formData.password;

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-white"></div>

      <div className="absolute top-20 right-10 size-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 size-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-pink-300/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
            <Sparkles className="size-4" />
            <span className="text-sm">Built for Nigerian Schools</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start Building Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              School's Digital Presence
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join hundreds of Nigerian schools transforming their digital
            presence with our offline-first, no-code platform.
          </p>

          <div className="space-y-4">
            {[
              "Drag-and-drop website builder",
              "Works offline with 3G optimization",
              "AI assistant for guidance",
              "NDPA 2023 compliant",
              "Education-specific templates",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="size-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Check className="size-4 text-white" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-600">Schools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">15min</div>
              <div className="text-sm text-gray-600">Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 mb-6">
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  activeTab === "login"
                    ? "bg-white shadow-md text-purple-600"
                    : "text-gray-600 hover:text-gray-900 cursor-pointer"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  activeTab === "signup"
                    ? "bg-white shadow-md text-purple-600"
                    : "text-gray-600 hover:text-gray-900 cursor-pointer"
                }`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        id="login-email"
                        type="email"
                        placeholder="admin@yourschool.edu.ng"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="login-password"
                        className="block text-sm text-gray-700"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me for 30 days
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isLoading || isDisabled}
                  >
                    Sign In to Dashboard
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-600 transition-colors flex items-center justify-center gap-3"
                  >
                    <Chrome className="size-5 text-gray-600" />
                    <span className="text-gray-700">Continue with Google</span>
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        id="signup-name"
                        type="text"
                        placeholder="John Okonkwo"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-school"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      School Name
                    </label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        id="signup-school"
                        type="text"
                        placeholder="Queen's College Lagos"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        value={formData.schoolName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            schoolName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        id="signup-email"
                        type="email"
                        placeholder="admin@yourschool.edu.ng"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2"
                      >
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                level <= passwordStrength
                                  ? getPasswordStrengthColor()
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        {passwordStrength > 0 && (
                          <p className="text-xs text-gray-600">
                            Password strength: {getPasswordStrengthText()}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    disabled={passwordStrength < 3 || isLoading || isDisabled}
                  >
                    Create Account
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-600 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Chrome className="size-5 text-gray-600" />
                    <span className="text-gray-700">Sign up with Google</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-gray-600">
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-purple-600 hover:text-purple-700 font-medium transition cursor-pointer hover:underline hover:underline-offset-2"
                >
                  Sign up for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-purple-600 hover:text-purple-700 font-medium transition cursor-pointer hover:underline hover:underline-offset-2"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthPage;
