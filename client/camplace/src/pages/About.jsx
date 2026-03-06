import { motion } from "motion/react";
import { Target, Users, Shield, Rocket } from "lucide-react";

export default function About() {
  const values = [
    { title: "Transparency", desc: "We believe in a clear and open placement process for everyone.", icon: <Target className="text-primary" /> },
    { title: "Efficiency", desc: "Streamlining recruitment to save time for both students and companies.", icon: <Rocket className="text-primary" /> },
    { title: "Inclusivity", desc: "Ensuring every student has equal access to career opportunities.", icon: <Users className="text-primary" /> },
    { title: "Security", desc: "Protecting user data with industry-standard security measures.", icon: <Shield className="text-primary" /> },
  ];

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-secondary text-white py-24 lg:py-32">
        <div className="page-container text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            About <span className="text-primary">CamPlace</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            We are dedicated to transforming the campus recruitment experience through innovation and technology.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="section-title">Empowering the Next Generation of Professionals</h2>
            <p className="body-text">
              CamPlace was born out of a simple need: to make the placement process transparent, efficient, and accessible. We believe that every student deserves a fair shot at their dream career, and every company deserves to find the best talent without the administrative headache.
            </p>
            <p className="body-text">
              Our platform serves as a bridge, connecting the academic world with the fast-paced corporate environment. We provide the tools, data, and community support needed to navigate the complex journey from classroom to boardroom.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-display font-bold text-primary">4+</p>
                <p className="muted-text">Years of Excellence</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-primary">2000+</p>
                <p className="muted-text">Success Stories</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" 
              alt="Team working" 
              className="rounded-[3rem] shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Core Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="card-white hover-card space-y-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="body-text !text-base">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
