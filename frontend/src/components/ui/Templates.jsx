import { GraduationCap, Calendar, FileText, Users } from "lucide-react";
import { motion } from "motion/react";
import { Element } from "react-scroll";

const templates = [
  {
    icon: GraduationCap,
    name: "Admissions Portal",
    description:
      "Pre-structured forms for applications with document upload support. WCAG 2.2 compliant and mobile-optimized.",
    image:
      "https://images.unsplash.com/photo-1627423894921-c55a18a2de90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjB1c2luZyUyMGNvbXB1dGVycyUyMGluJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3NjU2NTY3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: FileText,
    name: "Results Publishing",
    description:
      "Secure results portal with parent login access. Built-in privacy controls compliant with NDPA 2023.",
    image:
      "https://images.unsplash.com/photo-1648747067003-0e4660db791f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkaWdpdGFsJTIwZWR1Y2F0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzY1NjU2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Calendar,
    name: "Term Calendar & Events",
    description:
      "Keep parents updated with school calendar, term dates, events, and announcements in one place.",
    image:
      "https://images.unsplash.com/photo-1760548425425-e42e77fa38f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkZXNpZ24lMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzc2NTY1Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "from-purple-600 to-blue-500",
  },
  {
    icon: Users,
    name: "Staff Directory & PTA",
    description:
      "Showcase faculty profiles, qualifications, and PTA information with structured content blocks.",
    image:
      "https://images.unsplash.com/photo-1666281238998-59842bf7e10c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxhZnJpY2FuJTIwc3R1ZGVudHMlMjB1c2luZyUyMGNvbXB1dGVycyUyMGluJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3NjU2NTY3NHww&ixlib=rb-4.1.0&q=80&w=1080",
    color: "from-blue-600 to-purple-500",
  },
];

export function Templates() {
  return (
    <Element name="templates">
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-4">
              Templates
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pre-Built for Nigerian Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Start with professionally designed templates that address the
              unique needs of your school
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 z-10"></div>
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <div
                    className={`size-14 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}
                  >
                    <template.icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-200 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-xl transition-all">
            View All Templates
          </button>
        </motion.div> */}
        </div>
      </section>
    </Element>
  );
}
