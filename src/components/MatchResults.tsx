import { MatchData } from "@/pages/Index";
import { ArrowLeft, Target, CheckCircle2, XCircle, Lightbulb, AlertCircle } from "lucide-react";

interface MatchResultsProps {
  matchData: MatchData;
  onReset: () => void;
}

export const MatchResults = ({ matchData, onReset }: MatchResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-green-500/5";
    if (score >= 60) return "from-yellow-500/20 to-yellow-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <button
          onClick={onReset}
          className="flex items-center gap-2 mb-8 text-primary hover:underline transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" />
          Start New Analysis
        </button>

        {/* Match Score */}
        <div className="glass-card p-12 rounded-3xl mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">Match Score</h2>
          </div>
          
          <div className={`text-8xl font-bold mb-4 bg-gradient-to-br ${getScoreBg(matchData.matchScore)} bg-clip-text text-transparent`}>
            {matchData.matchScore}%
          </div>
          
          <p className="text-lg text-muted-foreground">
            {matchData.matchScore >= 80 && "Excellent match! Your resume aligns well with this position."}
            {matchData.matchScore >= 60 && matchData.matchScore < 80 && "Good match with room for improvement."}
            {matchData.matchScore < 60 && "Consider updating your resume to better match the job requirements."}
          </p>

          {/* ATS Score */}
          <div className="mt-8 p-6 bg-muted/30 rounded-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">ATS Compatibility Score</h3>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(matchData.atsScore)}`}>
              {matchData.atsScore}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Likelihood of passing Applicant Tracking Systems
            </p>
          </div>
        </div>

        {/* Keywords */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Matched Keywords */}
          <div className="glass-card p-8 rounded-3xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h3 className="text-2xl font-semibold">Matched Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchData.matchedKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="glass-card p-8 rounded-3xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-2xl font-semibold">Missing Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchData.missingKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="glass-card p-8 rounded-3xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {matchData.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="glass-card p-8 rounded-3xl animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h3 className="text-2xl font-semibold">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {matchData.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-1">!</span>
                  <span className="text-muted-foreground">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="glass-card p-8 rounded-3xl animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold">AI Suggestions</h3>
          </div>
          <div className="space-y-4">
            {matchData.suggestions.map((suggestion, idx) => (
              <div key={idx} className="p-4 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
