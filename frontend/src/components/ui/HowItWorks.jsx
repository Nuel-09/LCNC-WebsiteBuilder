import { MousePointer, Palette, Rocket } from "lucide-react";
import { motion } from "motion/react";
import { Element } from "react-scroll";

const steps = [
  {
    icon: MousePointer,
    step: "01",
    title: "Choose a Template",
    description:
      "Select from our library of education-specific templates designed for Nigerian schools. Each template is fully customizable.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Palette,
    step: "02",
    title: "Design with Tools",
    description:
      "Use drag-and-drop tools to customize your site. Add content, images, and branding. Get help from the AI assistant anytime you need guidance.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Launch Your Site",
    description:
      "Preview your website, make final adjustments, and publish. Your school website goes live instantly with secure hosting.",
    color: "from-purple-600 to-blue-500",
  },
];

export function HowItWorks() {
  return (
    <Element name="how-it-works">
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              From zero to online in three simple steps. No technical knowledge
              required.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 -translate-y-1/2 -z-10"></div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`size-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                    >
                      <step.icon className="size-8 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-gray-100">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
}
