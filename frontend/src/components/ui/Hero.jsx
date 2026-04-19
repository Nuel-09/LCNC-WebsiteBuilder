import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import { Element } from "react-scroll";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const nav = useNavigate();
  return (
    <Element name="home">
      {" "}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-white -z-10"></div>

        <div className="absolute top-20 right-10 size-72 bg-purple-300/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 size-96 bg-blue-300/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
                <Sparkles className="size-4" />
                <span className="text-sm">
                  No-Code Platform with AI Assistant
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Build Your School Website{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  With Easy Tools
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Visual drag-and-drop builder designed for non-technical school
                staff. Works offline, optimized for low bandwidth, with AI
                assistant guidance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={() => nav("/auth")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Start Building Free
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-800 rounded-lg border-2 border-gray-200 hover:border-purple-600 transition-colors cursor-pointer">
                  <a
                    href="https://demo.puckeditor.com/edit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Puck Inspiration
                  </a>
                </button>
              </div>

              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Schools Building</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">15min</div>
                  <div className="text-sm text-gray-600">Avg Build Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">AI Assistant</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1776278806688-64ef6a7e2cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjB3ZWIlMjBkZXNpZ24lMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzc2NTY1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern web design interface"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="size-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      AI Assistant Ready
                    </div>
                    <div className="text-xs text-gray-500">
                      Ask me anything as you build
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Element>
  );
}
