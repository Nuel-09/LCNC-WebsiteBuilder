import { Quote } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    quote:
      "We can now publish results and announcements instantly, even when internet is slow. This platform changed how we communicate with parents.",
    author: "Mrs. Adebayo",
    role: "School Administrator",
    school: "Lagos State",
  },
  {
    quote:
      "The offline feature is a game-changer. I can work on our website during power cuts, and everything syncs when we're back online.",
    author: "Mr. Okafor",
    role: "ICT Coordinator",
    school: "Enugu",
  },
  {
    quote:
      "Building our admissions portal took less than 30 minutes with the templates. The AI assistant guided me through every step.",
    author: "Miss Bello",
    role: "Secretary",
    school: "Abuja",
  },
];

export function Testimonial() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-4">
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by School Staff Across Nigeria
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Hear from non-technical staff who successfully built their school
            websites
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 relative"
            >
              <Quote className="size-10 text-purple-300 mb-4" />
              <p className="text-gray-700 leading-relaxed pb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-purple-200 pt-4">
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="text-sm text-purple-600 mt-1">
                  {testimonial.school}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
