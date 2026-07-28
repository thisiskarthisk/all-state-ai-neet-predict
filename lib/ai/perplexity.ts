import { PredictionResult, CollegePredictionResult } from './gemini';
import { rankPrompt, collegePrompt } from './prompts';

function cleanJsonResponse(text: string): any {
  if (!text) {
    throw new Error('Response text is empty');
  }

  let cleaned = text.trim();

  // Strip markdown code block wrappers
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Remove citations like [1], [2], [1][2] inserted by Perplexity search
  cleaned = cleaned.replace(/\[\d+\]/g, '');

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
      console.error('Failed to parse JSON from Perplexity. Raw text length:', text.length);
      throw new Error(`Failed to parse JSON response from Perplexity AI API: ${repairErr.message || initialErr}`);
    }
  }
}

/**
 * Repairs truncated JSON text by closing dangling strings, arrays, and objects
 */
function repairTruncatedJson(jsonStr: string): string {
  let s = jsonStr.trim();

  // Fix unclosed string at the end
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

  // Remove trailing comma
  s = s.replace(/,\s*$/, '');

  // Count open brackets/braces to balance them
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

  // Close remaining unclosed brackets/braces in reverse order
  while (stack.length > 0) {
    const open = stack.pop();
    if (open === '{') s += '}';
    if (open === '[') s += ']';
  }

  // Final cleanup of trailing commas
  s = s.replace(/,\s*([\}\]])/g, '$1');
  return s;
}

export async function predictMarkToRankWithPerplexity(
  marksNum: number,
  maxMarks: number,
  examName: string
): Promise<PredictionResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY || "";
  if (!apiKey) {
    throw new Error('Perplexity AI API key is not configured.');
  }

  const currentYear = new Date().getFullYear();

  const promptText = rankPrompt(marksNum, maxMarks, examName, currentYear);

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      max_tokens: 8000,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are an expert medical admissions analyst. You only respond with structured JSON output.'
        },
        {
          role: 'user',
          content: promptText
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'rank_prediction',
          schema: {
            type: 'object',
            properties: {
              expected: { type: 'integer' },
              rangeLow: { type: 'integer' },
              rangeHigh: { type: 'integer' },
              percentile: { type: 'number' },
              percentileLow: { type: 'number' },
              percentileHigh: { type: 'number' },
              confidenceLevel: { type: 'string' },
              trendAnalysis: { type: 'string' },
              whatThisMeans: { type: 'string' },
              averageRank: { type: 'integer' },
              years: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    year: { type: 'integer' },
                    rank: { type: 'integer' },
                    trend: { type: 'string' }
                  },
                  required: ['year', 'rank', 'trend']
                }
              },
              projectionNote: { type: 'string' }
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
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Perplexity AI Marks API Request failed:', errText);
    throw new Error('Perplexity AI Service is temporarily offline. Please try again.');
  }

  const resJson = await response.json();
  const content = resJson.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Perplexity AI API');
  }

  const aiData = cleanJsonResponse(content);

  // Recalculate averageRank to guarantee mathematical correctness
  if (aiData.years && Array.isArray(aiData.years) && aiData.years.length > 0) {
    const sum = aiData.years.reduce((acc: number, curr: any) => acc + (curr.rank || 0), 0);
    aiData.averageRank = Math.round(sum / aiData.years.length);
  }

  return aiData;
}

export async function predictCollegesWithPerplexity(
  rankNum: number,
  examName: string,
  examMetadata: { code: string; fullName: string },
  targetCategory: string,
  targetCoursesStr: string,
  preferredStateStr: string
): Promise<CollegePredictionResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY || "";
  if (!apiKey) {
    throw new Error('Perplexity AI API key is not configured.');
  }

  const promptText = collegePrompt(rankNum, examName, examMetadata, targetCategory, targetCoursesStr, preferredStateStr);

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      max_tokens: 8000,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are a professional medical admissions consultant specializing in NEET counselling in India. You only respond with structured JSON output.'
        },
        {
          role: 'user',
          content: promptText
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'college_prediction',
          schema: {
            type: 'object',
            properties: {
              colleges: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    state: { type: 'string' },
                    city: { type: 'string' },
                    collegeType: {
                      type: 'string',
                      enum: ['Government', 'Private', 'Deemed', 'Government-Aided']
                    },
                    courses: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          course: { type: 'string' },
                          categories: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                category: { type: 'string' },
                                cutoffRank: { type: 'integer' },
                                chanceOfAdmission: { type: 'string' }
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
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Perplexity AI Colleges API Request failed:', errText);
    throw new Error('Perplexity AI Service is temporarily offline. Please try again.');
  }

  const resJson = await response.json();
  const content = resJson.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Perplexity AI API');
  }

  return cleanJsonResponse(content);
}