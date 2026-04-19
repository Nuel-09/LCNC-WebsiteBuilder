import { Bot, Layout, Smartphone, Wifi, Globe, Shield } from "lucide-react";
import { motion } from "motion/react";
import { Element } from "react-scroll";

const features = [
  {
    icon: Layout,
    title: "Visual Drag & Drop Editor",
    description:
      "Intuitive visual builder designed for non-technical school staff. Create and edit pages without any coding knowledge.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Get step-by-step guidance with explainable suggestions. The AI helps you build faster while keeping you in full control.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Wifi,
    title: "Works Offline",
    description:
      "Built for intermittent connectivity. Edit your site offline and changes sync automatically when internet returns.",
    color: "from-blue-500 to-purple-600",
  },
  {
    icon: Smartphone,
    title: "Low-Bandwidth Optimized",
    description:
      "Designed for low-end devices and slow networks. Works smoothly on basic Android phones with limited data.",
    color: "from-purple-500 to-blue-600",
  },
  {
    icon: Globe,
    title: "School-Ready Templates",
    description:
      "Pre-built pages for Admissions, Results Portal, Events Calendar, Staff Directory, and PTA information.",
    color: "from-purple-600 to-blue-500",
  },
  {
    icon: Shield,
    title: "NDPA 2023 Compliant",
    description:
      "Privacy-by-design with full compliance to Nigerian Data Protection Act 2023 and WCAG 2.2 accessibility standards.",
    color: "from-blue-600 to-purple-500",
  },
];

export function Features() {
  return (
    <Element name="features">
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-4">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Tools, Simple Interface
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Everything you need to build and manage your school website - with
              AI support when you need it
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div
                  className={`size-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="size-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
}
