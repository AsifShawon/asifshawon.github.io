import { NextRequest, NextResponse } from 'next/server';

// POST /api/cgpa-extract
// Expects: { images: string[] (base64, no data URI), mimeType: string }
// Returns: { courses: { courseCode: string; courseName: string; credits: string; grade: string }[] }

// Helper function to create a timeout promise
function createTimeout(ms: number) {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
}

// Helper function to make API call with retry logic
async function makeGeminiRequest(apiUrl: string, payload: any, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Set timeout to 25 seconds (less than Vercel's 30s limit)
      const response = await Promise.race([
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        createTimeout(25000) // 25 second timeout
      ]);

      if (response.ok) {
        return response;
      }
      
      // If not ok, throw error to trigger retry
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API returned ${response.status}: ${errorText}`);
      
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on timeout for the last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const images: string[] = body.images || [];
    const mimeType: string = body.mimeType || 'image/png';

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided.' }, { status: 400 });
    }

    // Limit number of images to prevent timeout
    if (images.length > 5) {
      return NextResponse.json({ 
        error: 'Too many images. Please limit to 5 pages maximum.' 
      }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing GEMINI_API_KEY.' }, { status: 500 });
    }

    // Optimize prompt for faster processing
    const prompt = `Extract course data from this grade sheet. Return JSON only: {"courses":[{"courseCode":"","courseName":"","credits":"","grade":""}]}. Include all visible courses.`;

    const parts: any[] = [{ text: prompt }];
    images.forEach(data => parts.push({ inlineData: { mimeType, data } }));

    const payload = { 
      contents: [{ parts }],
      generationConfig: {
        maxOutputTokens: 2048, // Limit output to speed up response
        temperature: 0.1, // Lower temperature for more consistent output
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await makeGeminiRequest(apiUrl, payload);
    const result = await response.json();
    
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({ error: 'No valid content from model.' }, { status: 502 });
    }

    const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      // Try to extract JSON from response if parsing fails
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          return NextResponse.json({ 
            error: 'Failed to parse model response.', 
            raw: rawText.substring(0, 500) 
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          error: 'No valid JSON found in response.', 
          raw: rawText.substring(0, 500) 
        }, { status: 500 });
      }
    }

    return NextResponse.json(parsed, { status: 200 });
    
  } catch (e: any) {
    if (e.message === 'Request timeout') {
      return NextResponse.json({ 
        error: 'Request timed out. Please try with fewer pages or a smaller file.' 
      }, { status: 504 });
    }
    
    return NextResponse.json({ 
      error: e.message || 'Unexpected server error.' 
    }, { status: 500 });
  }
}
