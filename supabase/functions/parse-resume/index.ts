import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let text = "";

    // For now, we'll use a simple text extraction for PDFs and DOCX
    // In production, you'd use proper libraries like pdf-parse or mammoth
    if (file.type === "application/pdf") {
      // For PDF files, we'll read as text (simplified - in production use pdf-parse)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder();
      text = decoder.decode(uint8Array);
      
      // Clean up the extracted text
      text = text
        .replace(/[^\x20-\x7E\n]/g, " ") // Remove non-printable characters
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // For DOCX, similar approach (in production use mammoth)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const decoder = new TextDecoder();
      text = decoder.decode(uint8Array);
      
      text = text
        .replace(/[^\x20-\x7E\n]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    } else {
      // For text files
      text = await file.text();
    }

    if (!text || text.length < 50) {
      return new Response(
        JSON.stringify({ 
          error: "Could not extract sufficient text from the file. Please ensure your resume has readable text content." 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in parse-resume function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to parse resume";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
