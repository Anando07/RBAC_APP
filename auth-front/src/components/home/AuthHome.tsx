import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Sparkles,
  Fingerprint,
  ArrowRight,
  Zap,
  Code2,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { useOutletContext } from "react-router";
import { translations } from "@/locales/translations";
import type { OutletContextType } from "@/pages/RootLayout";

export default function AuthHome() {
  const { lang } = useOutletContext<OutletContextType>();
  const t = translations[lang] || translations.en;

  // Colorful icon badges for features
  const featureBadges = [
    {
      icon: <Fingerprint className="w-7 h-7 text-indigo-500" />,
      border: "border-indigo-500/30",
      bg: "bg-indigo-500/10",
      hoverBg: "group-hover:bg-indigo-500",
      glow: "hover:shadow-indigo-500/20",
    },
    {
      icon: <Lock className="w-7 h-7 text-purple-500" />,
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      hoverBg: "group-hover:bg-purple-500",
      glow: "hover:shadow-purple-500/20",
    },
    {
      icon: <Shield className="w-7 h-7 text-cyan-500" />,
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      hoverBg: "group-hover:bg-cyan-500",
      glow: "hover:shadow-cyan-500/20",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors overflow-hidden">
      {/* Dynamic Colorful Glow Spots */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-500/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[65%] left-[-10%] w-[500px] h-[500px] bg-pink-500/15 blur-[150px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 text-center flex flex-col items-center justify-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-500 dark:text-indigo-400 text-sm font-semibold mb-8 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
          <span>Next-Gen Access Control Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15]"
        >
          Need Secure.{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Fast.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          {t.hero?.subtitle ||
            "Enterprise-grade role-based access control built for modern web applications. Scale security effortlessly."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <Button
            size="lg"
            className="rounded-xl text-base font-semibold px-8 h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition-all border-none"
          >
            {t.hero?.getStarted || "Get Started"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl text-base font-semibold px-8 h-12 border-indigo-500/30 hover:bg-indigo-500/10 backdrop-blur-sm"
          >
            {t.hero?.learnMore || "Learn More"}
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t.features?.title || "All Features"}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Everything you need to secure your users, roles, and administrative routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(t.features?.list || [
            { title: "Biometric Login", desc: "Next-level security with fingerprint and facial recognition." },
            { title: "Multi-Layer Encryption", desc: "Industry-grade encrypted authentication for complete safety." },
            { title: "Smart Access Control", desc: "AI-powered access system that adapts to real-time threats." },
          ]).map((f, i) => {
            const style = featureBadges[i % featureBadges.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full bg-card/40 backdrop-blur-xl border-border/60 hover:border-indigo-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl ${style.glow} group`}>
                  <CardContent className="p-8 flex flex-col items-start">
                    <div className={`p-3.5 rounded-xl border ${style.border} ${style.bg} ${style.hoverBg} group-hover:text-white transition-all duration-300 mb-6`}>
                      {style.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-6 relative border-t border-indigo-500/10 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t.whyUs?.title || "Why Choose Our Auth Platform?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="w-5 h-5 text-amber-500" />,
                badgeBg: "bg-amber-500/10 border-amber-500/20",
                title: t.whyUs?.ai?.title || "AI-Driven Security",
                desc: t.whyUs?.ai?.desc || "Real-time monitoring detects suspicious activities and prevents unauthorized access.",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                badgeBg: "bg-emerald-500/10 border-emerald-500/20",
                title: t.whyUs?.speed?.title || "Lightning-Fast Performance",
                desc: t.whyUs?.speed?.desc || "Built for scale with instant response times for authentication flows.",
              },
              {
                icon: <Code2 className="w-5 h-5 text-cyan-500" />,
                badgeBg: "bg-cyan-500/10 border-cyan-500/20",
                title: t.whyUs?.api?.title || "Developer-Friendly API",
                desc: t.whyUs?.api?.desc || "Integrate in minutes with clean, powerful, well-structured APIs.",
              },
              {
                icon: <Sliders className="w-5 h-5 text-pink-500" />,
                badgeBg: "bg-pink-500/10 border-pink-500/20",
                title: t.whyUs?.custom?.title || "Highly Customizable",
                desc: t.whyUs?.custom?.desc || "Theme, workflow, and control options designed to match your app perfectly.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-card/60 border border-border/50 hover:border-indigo-500/30 flex items-start gap-4 transition-all"
              >
                <div className={`p-2.5 rounded-xl border ${item.badgeBg} shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colorful Call To Action */}
      <section className="relative py-28 px-6 text-center">
        <div className="max-w-4xl mx-auto relative rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border border-indigo-500/30 p-12 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10">
            {t.cta?.title || "Start Securing Your App Today"}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground text-lg relative z-10">
            {t.cta?.subtitle || "Join thousands of developers already building with our authentication system."}
          </p>
          <Button
            size="lg"
            className="mt-8 px-8 h-12 text-base font-semibold rounded-xl relative z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 border-none hover:opacity-95"
          >
            {t.cta?.button || "Create Free Account"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} RBAC. All rights reserved.
      </footer>
    </div>
  );
}