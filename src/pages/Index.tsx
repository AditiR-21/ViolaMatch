import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ResumeUpload } from "@/components/ResumeUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { MatchResults } from "@/components/MatchResults";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export interface MatchData {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  atsScore: number;
}

const Index = () => {
  const [step, setStep] = useState<"landing" | "upload" | "results">("landing");
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGetStarted = () => {
    setStep("upload");
  };

  const handleResumeUploaded = (text: string) => {
    setResumeText(text);
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      toast.error("Please upload your resume and enter a job description");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeText,
          jobDescription,
        },
      });

      if (error) throw error;

      setMatchData(data);
      setStep("results");
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep("landing");
    setResumeText("");
    setJobDescription("");
    setMatchData(null);
  };

  return (
    <div className="min-h-screen">
      <ThemeToggle />
      {step === "landing" && <Hero onGetStarted={handleGetStarted} />}
      
      {step === "upload" && (
        <div className="min-h-screen py-20 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Upload & Analyze
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your resume and paste the job description to get instant AI-powered insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <ResumeUpload onResumeUploaded={handleResumeUploaded} />
              <JobDescriptionInput 
                value={jobDescription}
                onChange={setJobDescription}
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-smooth font-medium"
              >
                Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!resumeText || !jobDescription || isAnalyzing}
                className="px-8 py-4 rounded-full bg-white dark:bg-black text-primary border-2 border-primary hover:shadow-glow hover:scale-105 transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Match"}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "results" && matchData && (
        <MatchResults 
          matchData={matchData}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default Index;
