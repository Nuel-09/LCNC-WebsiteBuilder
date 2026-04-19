import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const benefits = [
  "Works offline with auto-sync",
  "Optimized for low-end devices",
  "NDPA 2023 compliant",
  "Education-specific templates",
];

export function CTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 size-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 size-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Transform Your School's Digital Presence?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl">
            Join hundreds of Nigerian schools building professional websites
            with easy-to-use tools and AI assistance
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                <CheckCircle className="size-5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-transparent border-2 hover:border-white hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
              Start Building Now
              <ArrowRight className="size-5 group-hover:translate-x-1 group-hover:text-white transition-transform" />
            </button>
            <button className="px-8 py-4 bg-transparent text-white rounded-lg border-2 border-white hover:bg-white hover:text-purple-600 transition-all cursor-pointer">
              <a
                href="https://demo.puckeditor.com/edit"
                target="_blank"
                rel="noreferrer"
              >
                Puck Inspiration
              </a>
            </button>
          </div>

          <p className="text-purple-200 mt-6 text-sm">
            Trusted by 500+ schools across Nigeria
          </p>
        </motion.div>
      </div>
    </section>
  );
}
