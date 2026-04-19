import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const benefits = [
  {
    title: "Built for Low-Resource Environments",
    items: [
      "Works on low-end Android devices",
      "Optimized for 3G/slow networks",
      "Offline editing with auto-sync",
      "Minimal data consumption",
    ],
  },
  {
    title: "Governance & Safety",
    items: [
      "Role-based access (Admin, Editor, Viewer)",
      "Approval workflow before publishing",
      "Version history and rollback",
      "Automatic backup and export",
    ],
  },
  {
    title: "Nigerian School Focused",
    items: [
      "Admissions & Results Portal templates",
      "Term Calendar & Events management",
      "Staff Directory & PTA pages",
      "Multi-language content support",
    ],
  },
];

export function Benefits() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
            Why Schools Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Designed for Nigerian Schools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Addressing real challenges faced by schools in low-resource
            environments
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                {benefit.title}
              </h3>
              <ul className="space-y-4">
                {benefit.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
