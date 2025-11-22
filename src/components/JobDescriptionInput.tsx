import { Briefcase } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionInput = ({ value, onChange }: JobDescriptionInputProps) => {
  return (
    <div className="glass-card p-8 rounded-3xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Job Description</h2>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here...&#10;&#10;Include requirements, responsibilities, qualifications, and any other relevant details from the job posting."
        className="w-full h-64 p-4 rounded-2xl border-2 border-border bg-background/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth resize-none"
      />

      <div className="mt-6 p-4 bg-muted/30 rounded-xl">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Copy the entire job posting for more accurate keyword matching and insights.
        </p>
      </div>
    </div>
  );
};
