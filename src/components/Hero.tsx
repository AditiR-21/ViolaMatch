import { Sparkles, ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero opacity-60" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-float"
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Resume Analysis</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ViolaMatch AI
          </span>
        </h1>

        <p className="text-2xl md:text-3xl mb-4 text-foreground/80 max-w-3xl animate-fade-in font-serif" style={{ animationDelay: "0.2s" }}>
          Match Your Resume with Any Job in Seconds
        </p>

        <p className="text-lg text-muted-foreground mb-12 max-w-2xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Get instant AI-powered insights, keyword analysis, and actionable suggestions to optimize your resume for any job description
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={onGetStarted}
            className="group px-8 py-4 rounded-full bg-gradient-primary text-white hover:shadow-glow transition-smooth font-medium text-lg flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href="#features"
            className="px-8 py-4 rounded-full glass-card hover:bg-primary/10 transition-smooth font-medium text-lg"
          >
            Learn More
          </a>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl animate-fade-in" style={{ animationDelay: "0.5s" }}>
          {[
            { title: "Instant Analysis", desc: "AI-powered matching in seconds" },
            { title: "Keyword Extraction", desc: "Find what's missing from your resume" },
            { title: "Smart Suggestions", desc: "Get actionable improvement tips" },
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl hover:shadow-glow transition-smooth">
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
