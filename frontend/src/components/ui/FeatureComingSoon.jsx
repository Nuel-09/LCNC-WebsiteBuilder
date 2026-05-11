import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const FeatureComingSoon = ({ title }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="size-24 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="size-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          This feature is coming soon. We're working hard to bring you the best
          experience for building your school's digital presence.
        </p>
      </motion.div>
    </div>
  );
};

export default FeatureComingSoon;
