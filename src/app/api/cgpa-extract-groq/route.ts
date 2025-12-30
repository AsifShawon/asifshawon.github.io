import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// POST /api/cgpa-extract-groq
// Expects: { text: string } - OCR-extracted text from grade sheet
// Returns: { courses: { courseCode: string; courseName: string; credits: string; grade: string }[] }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = body.text || '';

    if (!text.trim()) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Server missing GROQ_API_KEY.' }, { status: 500 });
    }

    // Initialize Groq client inside the handler to ensure env is loaded
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const systemPrompt = `You are a data extraction assistant. Extract course information from the provided grade sheet text.
Return ONLY valid JSON in this exact format, nothing else:
{"courses":[{"courseCode":"CSE101","courseName":"Introduction to Programming","credits":"3","grade":"A"}]}

Rules:
- Extract ALL courses you can find
- courseCode: The course identifier (e.g., CSE101, MATH201)
- courseName: Full name of the course
- credits: Credit hours as a string number
- grade: Letter grade (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, F)
- If a field is unclear, make your best guess based on context
- Return empty courses array if no courses found`;

    // Try openai/gpt-oss-120b first, fallback to llama if not available
    let completion;
    try {
      completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract courses from this grade sheet text:\n\n${text}` }
        ],
        temperature: 0.1,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });
    } catch (modelError: any) {
      console.log('GPT-OSS-120B error:', modelError.message, '- falling back to llama-3.3-70b-versatile');
      // Fallback to a reliable Groq model
      completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract courses from this grade sheet text:\n\n${text}` }
        ],
        temperature: 0.1,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });
    }

    const rawText = completion.choices[0]?.message?.content || '';
    
    console.log('Model raw response:', rawText.substring(0, 1000));
    
    if (!rawText) {
      return NextResponse.json({ error: 'No valid content from model.' }, { status: 502 });
    }

    // Clean and parse JSON response
    let jsonText = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^\s*[\r\n]/gm, '')
      .trim();
    
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
          console.error('JSON parse error. Raw text:', rawText);
          return NextResponse.json({ 
            error: 'Failed to parse model response.', 
            raw: rawText.substring(0, 500) 
          }, { status: 500 });
        }
      } else {
        console.error('No JSON found. Raw text:', rawText);
        return NextResponse.json({ 
          error: 'No valid JSON found in response.', 
          raw: rawText.substring(0, 500) 
        }, { status: 500 });
      }
    }

    return NextResponse.json(parsed, { status: 200 });
    
  } catch (e: any) {
    console.error('Groq API error:', e);
    console.error('Error details:', JSON.stringify(e, null, 2));
    return NextResponse.json({ 
      error: e.message || 'Unexpected server error.',
      details: e.error?.message || e.status || 'Unknown error'
    }, { status: 500 });
  }
}
