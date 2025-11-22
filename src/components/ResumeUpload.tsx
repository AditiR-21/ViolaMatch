import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ResumeUploadProps {
  onResumeUploaded: (text: string) => void;
}

export const ResumeUpload = ({ onResumeUploaded }: ResumeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = async (file: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setFileName(file.name);
    
    try {
      const text = await extractTextFromFile(file);
      onResumeUploaded(text);
      setIsUploaded(true);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read file. Please try again.");
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === "text/plain") {
      return await file.text();
    }
    
    // For PDF and DOCX, we'll send to backend
    const formData = new FormData();
    formData.append("file", file);
    
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.functions.invoke("parse-resume", {
      body: formData,
    });

    if (error) throw error;
    return data.text;
  };

  return (
    <div className="glass-card p-8 rounded-3xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Upload Resume</h2>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-smooth hover:border-primary hover:bg-primary/5
          ${isDragging ? "border-primary bg-primary/10" : "border-border"}
          ${isUploaded ? "border-primary bg-primary/5" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploaded ? (
          <div className="flex flex-col items-center gap-4 animate-scale-in">
            <CheckCircle2 className="w-16 h-16 text-primary" />
            <div>
              <p className="font-medium text-lg mb-1">Resume Uploaded</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsUploaded(false);
                setFileName("");
              }}
              className="text-sm text-primary hover:underline"
            >
              Upload Different File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-16 h-16 text-primary" />
            <div>
              <p className="font-medium text-lg mb-1">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (PDF, DOCX, TXT)
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-xl">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Make sure your resume includes your skills, experience, and education for the best analysis.
        </p>
      </div>
    </div>
  );
};
