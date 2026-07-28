import { rankPrompt, collegePrompt } from "./prompts";

export interface PredictionResult {
  expected: number;
  rangeLow: number;
  rangeHigh: number;
  percentile: number;
  percentileLow: number;
  percentileHigh: number;
  confidenceLevel: string;
  trendAnalysis: string;
  whatThisMeans: string;
  averageRank: number;
  years: Array<{
    year: number;
    rank: number;
    trend: string;
  }>;
  projectionNote: string;
}

function cleanJsonResponse(text: string): any {
  if (!text) {
    throw new Error('Response text is empty');
  }

  let cleaned = text.trim();

  // Strip markdown code block wrappers
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Extract content between first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else if (firstBrace !== -1) {
    cleaned = cleaned.substring(firstBrace);
  }

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([\}\]])/g, '$1');

  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // Fallback: repair truncated JSON by balancing unclosed strings, arrays, and objects
    try {
      const repaired = repairTruncatedJson(cleaned);
      return JSON.parse(repaired);
    } catch (repairErr: any) {
      console.error('Failed to parse JSON from Gemini. Raw text length:', text.length);
      throw new Error(`Failed to parse JSON response from Gemini AI API: ${repairErr.message || initialErr}`);
    }
  }
}

/**
 * Repairs truncated JSON text by closing dangling strings, arrays, and objects
 */
function repairTruncatedJson(jsonStr: string): string {
  let s = jsonStr.trim();

  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
    } else if (ch === '\\') {
      escape = true;
    } else if (ch === '"') {
      inString = !inString;
    }
  }

  if (inString) {
    s += '"';
  }

  s = s.replace(/,\s*$/, '');

  const stack: string[] = [];
  inString = false;
  escape = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
    } else if (ch === '\\') {
      escape = true;
    } else if (ch === '"') {
      inString = !inString;
    } else if (!inString) {
      if (ch === '{' || ch === '[') {
        stack.push(ch);
      } else if (ch === '}' && stack[stack.length - 1] === '{') {
        stack.pop();
      } else if (ch === ']' && stack[stack.length - 1] === '[') {
        stack.pop();
      }
    }
  }

  while (stack.length > 0) {
    const open = stack.pop();
    if (open === '{') s += '}';
    if (open === '[') s += ']';
  }

  s = s.replace(/,\s*([\}\]])/g, '$1');
  return s;
}

export async function predictMarkToRankWithGemini(
  marksNum: number,
  maxMarks: number,
  examName: string
): Promise<PredictionResult> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error('Gemini AI API key is not configured.');
  }

  const currentYear = new Date().getFullYear();

  const promptText = rankPrompt(marksNum, maxMarks, examName, currentYear);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            expected: { type: 'INTEGER' },
            rangeLow: { type: 'INTEGER' },
            rangeHigh: { type: 'INTEGER' },
            percentile: { type: 'NUMBER' },
            percentileLow: { type: 'NUMBER' },
            percentileHigh: { type: 'NUMBER' },
            confidenceLevel: { type: 'STRING' },
            trendAnalysis: { type: 'STRING' },
            whatThisMeans: { type: 'STRING' },
            averageRank: { type: 'INTEGER' },
            years: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  year: { type: 'INTEGER' },
                  rank: { type: 'INTEGER' },
                  trend: { type: 'STRING' }
                },
                required: ['year', 'rank', 'trend']
              }
            },
            projectionNote: { type: 'STRING' }
          },
          required: [
            'expected',
            'rangeLow',
            'rangeHigh',
            'percentile',
            'percentileLow',
            'percentileHigh',
            'confidenceLevel',
            'trendAnalysis',
            'whatThisMeans',
            'averageRank',
            'years',
            'projectionNote'
          ]
        }
      }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini AI Marks API Request failed:', errText);
    throw new Error("Oops! We're experiencing a temporary issue while generating your NEET Predict data. Please try again in a few minutes. If you need immediate help, contact our experts.");
  }

  const resJson = await response.json();
  const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Empty response from Gemini AI API');
  }

  const aiData = cleanJsonResponse(content);

  // Recalculate averageRank to guarantee mathematical correctness
  if (aiData.years && Array.isArray(aiData.years) && aiData.years.length > 0) {
    const sum = aiData.years.reduce((acc: number, curr: any) => acc + (curr.rank || 0), 0);
    aiData.averageRank = Math.round(sum / aiData.years.length);
  }

  return aiData;
}

export interface CollegePredictionResult {
  colleges: Array<{
    name: string;
    state: string;
    city: string;
    collegeType: 'Government' | 'Private' | 'Deemed' | 'Government-Aided';
    courses: Array<{
      course: string;
      categories: Array<{
        category: string;
        cutoffRank: number;
        chanceOfAdmission: string;
      }>;
      counsellingDetail?: {
        type: string;
        events: Array<{
          date: string;
          event: string;
          additionalDetails?: string | null;
        }>;
      };
    }>;
  }>;
}

export async function predictCollegesWithGemini(
  rankNum: number,
  examName: string,
  examMetadata: { code: string; fullName: string },
  targetCategory: string,
  targetCoursesStr: string,
  preferredStateStr: string
): Promise<CollegePredictionResult> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error('Gemini AI API key is not configured.');
  }

  const promptText = collegePrompt(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            colleges: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  state: { type: 'STRING' },
                  city: { type: 'STRING' },
                  collegeType: {
                    type: 'STRING',
                    enum: ['Government', 'Private', 'Deemed', 'Government-Aided']
                  },
                  courses: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        course: { type: 'STRING' },
                        categories: {
                          type: 'ARRAY',
                          items: {
                            type: 'OBJECT',
                            properties: {
                              category: { type: 'STRING' },
                              cutoffRank: { type: 'INTEGER' },
                              chanceOfAdmission: { type: 'STRING' }
                            },
                            required: ['category', 'cutoffRank', 'chanceOfAdmission']
                          }
                        }
                      },
                      required: ['course', 'categories']
                    }
                  }
                },
                required: ['name', 'state', 'city', 'collegeType', 'courses']
              }
            }
          },
          required: ['colleges']
        }
      }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Gemini AI API Request failed:', errText);
    throw new Error("Oops! We're experiencing a temporary issue while generating your NEET Predict data. Please try again in a few minutes. If you need immediate help, contact our experts.");
  }

  const resJson = await response.json();
  const content = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Gemini AI Service returned an empty response. Please try again.');
  }

  try {
    return cleanJsonResponse(content);
  } catch (err: any) {
    console.error('Failed to parse Clean JSON from Gemini response:', err);
    throw new Error('Failed to parse colleges data from Gemini AI response.');
  }
}
