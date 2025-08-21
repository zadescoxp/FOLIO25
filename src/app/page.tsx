import Footer from "@/components/footer";
import Hero from "@/components/hero";
import ProgressiveBlur from "@/components/magicui/progressive-blur";
import Project from "@/components/project";
import Skills from "@/components/skills";
import Statement from "@/components/statement";
import Testimonials from "@/components/testimonials";
import Bar from "@/components/UI/bar";
import Loading from "@/components/UI/Loading";

export default function Home() {
  return (
    <div className="relative overflow-auto">
      <div className="font-sans">
        <Loading />
        <Hero />
        <Skills />
        <Project />
        <Testimonials />
        <Statement />
        <Footer />
        <Bar />
      </div>


      <ProgressiveBlur height="30%" position="bottom" className="fixed" />
    </div>
  );
}
