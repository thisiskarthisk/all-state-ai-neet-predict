import { NextRequest, NextResponse } from 'next/server';
import { predictMarkToRankWithGemini } from '@/lib/ai/gemini';
import { predictMarkToRankWithPerplexity } from '@/lib/ai/perplexity';
import { AI_API_TO_USE } from '@/constants';

// POST /api/ai-predict-markTorank
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { marks, examType } = body;

    const marksNum = typeof marks === 'number' && marks >= 0 ? marks : null;
    if (marksNum === null) {
      return NextResponse.json({ error: 'Please enter a valid marks score for rank prediction.' }, { status: 400 });
    }

    const selectedExam = examType || 'NEET_UG';

    let maxMarks = 720;
    let examName = 'NEET UG';
    if (selectedExam === 'NEET_PG') {
      maxMarks = 800;
      examName = 'NEET PG';
    } else if (selectedExam === 'NEET_MDS') {
      maxMarks = 960;
      examName = 'NEET MDS';
    }

    let aiData;
    const usePerplexityFirst = AI_API_TO_USE === 'perplexity';

    try {
      if (usePerplexityFirst) {
        aiData = await predictMarkToRankWithPerplexity(marksNum, maxMarks, examName);
      } else {
        aiData = await predictMarkToRankWithGemini(marksNum, maxMarks, examName);
      }
    } catch (primaryErr: any) {
      console.warn('Primary AI provider failed, attempting fallback...', primaryErr?.message);
      try {
        if (usePerplexityFirst) {
          aiData = await predictMarkToRankWithGemini(marksNum, maxMarks, examName);
        } else if (process.env.PERPLEXITY_API_KEY) {
          aiData = await predictMarkToRankWithPerplexity(marksNum, maxMarks, examName);
        } else {
          throw primaryErr;
        }
      } catch {
        throw primaryErr;
      }
    }

    return NextResponse.json(aiData);
  } catch (error: any) {
    console.error('Predict Marks to Rank AI Error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}