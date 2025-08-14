import { NextRequest, NextResponse } from 'next/server';

// POST /api/cgpa-extract
// Expects: { images: string[] (base64, no data URI), mimeType: string }
// Returns: { courses: { courseCode: string; courseName: string; credits: string; grade: string }[] }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const images: string[] = body.images || [];
    const mimeType: string = body.mimeType || 'image/png';

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY; // server preferred
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing GEMINI_API_KEY.' }, { status: 500 });
    }

    const prompt = `Analyze these images of a university grade sheet. Extract course code, course name, credits, and grade for each course across all pages. Return a single JSON object with a "courses" array. Keys must be "courseCode", "courseName", "credits", "grade". Use empty strings for missing values.`;

    const parts: any[] = [{ text: prompt }];
    images.forEach(data => parts.push({ inlineData: { mimeType, data } }));

    const payload = { contents: [{ parts }] };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: err?.error?.message || 'Gemini request failed.' }, { status: response.status });
    }

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
      return NextResponse.json({ error: 'Failed to parse model JSON.', raw: rawText }, { status: 500 });
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unexpected server error.' }, { status: 500 });
  }
}
