import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/ui/Hero";
import { Features } from "@/components/ui/Features";
import { Benefits } from "@/components/ui/Benefits";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { Templates } from "@/components/ui/Templates";
import { Testimonial } from "@/components/ui/Testimonial";
import { CTA } from "@/components/ui/CTA";
import { Footer } from "@/components/ui/Footer";

function LandingPage() {
  const { token } = useAppContext();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <Templates />
      <Testimonial />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
