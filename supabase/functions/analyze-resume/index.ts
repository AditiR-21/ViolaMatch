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
    const { resumeText, jobDescription } = await req.json();
    
    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Resume text and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI for analysis
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert resume analyzer and career coach. Analyze resumes against job descriptions and provide detailed, actionable feedback. Always respond with valid JSON only, no markdown formatting.`
          },
          {
            role: "user",
            content: `Analyze this resume against the job description and provide a detailed analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your response as a JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "matchedKeywords": [<array of keywords found in both resume and JD>],
  "missingKeywords": [<array of important keywords from JD missing in resume>],
  "strengths": [<array of 3-5 strength points>],
  "weaknesses": [<array of 3-5 weakness points>],
  "suggestions": [<array of 5-7 specific actionable suggestions>]
}

Focus on:
- Technical skills and tools mentioned
- Years of experience alignment
- Educational requirements
- Certifications and qualifications
- Industry-specific terminology
- Soft skills mentioned in the JD

Provide specific, actionable feedback.`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to analyze resume");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the AI response
    let analysisData;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      analysisData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify(analysisData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
