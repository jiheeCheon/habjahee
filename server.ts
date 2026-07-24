import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "placeholder_key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

/**
 * Executes a Gemini request with automatic retry (exponential backoff) and model fallback.
 */
async function generateContentWithRetry(
  ai: GoogleGenAI,
  contents: string,
  config: any,
  primaryModel: string = "gemini-3.5-flash",
  fallbackModel: string = "gemini-3.1-flash-lite"
) {
  const models = [primaryModel, fallbackModel];
  let lastError: any = null;

  for (const modelName of models) {
    const attempts = 3;
    let delayMs = 1000;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[Gemini] Calling ${modelName} (Attempt ${attempt}/${attempts})`);
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config,
        });

        if (response) {
          console.log(`[Gemini] Successfully retrieved response using ${modelName}`);
          return response;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini] Error with ${modelName} on attempt ${attempt}:`, err.message || err);

        const errMsg = String(err.message || "").toLowerCase();
        const errStatus = String(err.status || "").toUpperCase();
        const errCode = Number(err.code || 0);

        const isTransient = 
          errStatus === "UNAVAILABLE" || 
          errStatus === "RESOURCE_EXHAUSTED" || 
          errCode === 503 || 
          errCode === 429 || 
          errMsg.includes("experiencing high demand") || 
          errMsg.includes("temporary") || 
          errMsg.includes("unavailable") || 
          errMsg.includes("too many requests") || 
          errMsg.includes("503");

        if (isTransient && attempt < attempts) {
          console.log(`[Gemini] Sleeping ${delayMs}ms before retrying ${modelName}...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs *= 2;
        } else {
          break;
        }
      }
    }
  }

  throw lastError;
}

// API endpoint to search Hanja
app.post("/api/search-hanja", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "검색어를 입력해 주세요." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API 키가 설정되지 않았습니다. Vercel의 Settings > Environment Variables에서 GEMINI_API_KEY를 등록해 주세요."
    });
  }

  try {
    const ai = getGemini();
    
    const systemPrompt = `You are an expert in Korean Hanja (Chinese characters used in Korean).
Analyze the query and find matching Hanja characters.
The query could be:
1. A single Chinese character (e.g., '明', '韓')
2. A Korean word or phonetic reading (e.g., '학교', '배울 학', '명')
3. A definition (e.g., '밝다', '배우다')

Find the most appropriate matching Hanja character(s) (up to 5 if the query is a single-syllable Korean reading like '명', or exactly 1 if it is a specific Hanja like '明' or a specific word composition).
Return a JSON array of matched Hanja details. Ensure all fields are filled accurately in Korean:
- character: The Hanja glyph itself
- meaning: Korean meaning (훈 - e.g., "밝을", "배울")
- reading: Korean reading (음 - e.g., "명", "학")
- meaningReading: Combined (훈음 - e.g., "밝을 명", "배울 학")
- radical: Hanja radical glyph (부수)
- radicalName: Korean reading of radical (부수명 - e.g., "날 일", "글월 문")
- strokeCount: Total stroke count of Hanja (integer or string)
- level: Standard Hanja competency grade level, e.g., "8급", "7급", "준4급", etc.
- exampleWords: Array of 2 to 3 common high-quality Korean vocabulary words utilizing this character. Each word must have:
  - word: Word written in Hanja (e.g. "文明" or "學校")
  - reading: Word reading in Hangul (e.g. "문명" or "학교")
  - definition: Definition of the word in Korean.
- tip: A memorable, short, and elegant explanation or story about how the character is composed to make it easy to memorize (written in natural, polite Korean).`;

    const config = {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        description: "List of matched Hanja characters with analytical details.",
        items: {
          type: Type.OBJECT,
          required: [
            "character",
            "meaning",
            "reading",
            "meaningReading",
            "radical",
            "radicalName",
            "strokeCount",
            "level",
            "exampleWords",
            "tip"
          ],
          properties: {
            character: { type: Type.STRING },
            meaning: { type: Type.STRING },
            reading: { type: Type.STRING },
            meaningReading: { type: Type.STRING },
            radical: { type: Type.STRING },
            radicalName: { type: Type.STRING },
            strokeCount: { type: Type.STRING },
            level: { type: Type.STRING },
            tip: { type: Type.STRING },
            exampleWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["word", "reading", "definition"],
                properties: {
                  word: { type: Type.STRING },
                  reading: { type: Type.STRING },
                  definition: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    };

    const response = await generateContentWithRetry(
      ai,
      `Search query: "${query}"`,
      config,
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite"
    );

    const parsedData = JSON.parse(response.text?.trim() || "[]");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Hanja query error after fallback & retries: ", error);
    
    const isDemandError = String(error.message || "").toLowerCase().includes("experiencing high demand") ||
      String(error.message || "").toLowerCase().includes("503") ||
      (error.code === 503) ||
      (error.status === "UNAVAILABLE");
    
    if (isDemandError) {
      return res.status(503).json({
        error: "현재 Gemini AI 모델에 일시적인 접속량이 매우 집중되고 있습니다. 자동 복구 재시도를 진행했으나 서버 지연 상태가 지속되었습니다. 2~3초 후 검색 버튼을 다시 눌러 주시면 정상 모델로 즉각 자동 재시도합니다!"
      });
    }

    return res.status(500).json({
      error: `한자 검색 도중 오류가 발생했습니다: ${error.message || error}`
    });
  }
});

// API endpoint to search Four-Character Idioms (사자성어)
app.post("/api/search-idiom", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "사자성어 검색어를 입력해 주세요." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API 키가 설정되지 않았습니다. Vercel의 Settings > Environment Variables에서 GEMINI_API_KEY를 등록해 주세요."
    });
  }

  try {
    const ai = getGemini();

    const systemPrompt = `You are a highly educated expert in Four-Character Idioms (사자성어) used in Korea.
Analyze the user's query and find appropriate matching Four-Character Idioms (사자성어).
The query could be:
1. An idiom in Chinese characters or Korean reading (e.g. '유유자적', '悠悠自適', '이심전심')
2. A theme, situation, keyword, or emotion in Korean (e.g., '여유', '우정', '친구', '노력', '성공', '공부', '실패')
3. Meaning or description (e.g. '마음으로 전하다', '서로 뜻이 통하다')

CRITICAL SPELLING & TYPO CORRECTION GUIDE:
- Users frequently enter phonetic modifications, misheard readings, or slight Chinese character variations due to misconceptions.
- You MUST identify these sound-alike patterns or character approximations and map to standard Four-Character Idioms.

Find the most appropriate matching Four-Character Idioms (up to 4 idioms depending on the breadth of query).
Return a JSON array of matched idiom details. Ensure all fields are filled accurately in Korean:
- idiom: The 4 Chinese characters
- reading: Korean phonetic pronunciation reading
- meaning: Detailed, clear, and elegant Korean explanation/definition
- literalMeaning: Character-by-character translation
- tip: A memorable story or background historical origin.`;

    const config = {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        description: "List of matched Four-Character Idioms with origin and definitions.",
        items: {
          type: Type.OBJECT,
          required: [
            "idiom",
            "reading",
            "meaning",
            "literalMeaning",
            "tip"
          ],
          properties: {
            idiom: { type: Type.STRING },
            reading: { type: Type.STRING },
            meaning: { type: Type.STRING },
            literalMeaning: { type: Type.STRING },
            tip: { type: Type.STRING }
          }
        }
      }
    };

    const response = await generateContentWithRetry(
      ai,
      `Find Four-Character Idioms matching query: "${query}"`,
      config,
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite"
    );

    const parsedData = JSON.parse(response.text?.trim() || "[]");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Idiom query error after fallback & retries: ", error);

    const isDemandError = String(error.message || "").toLowerCase().includes("experiencing high demand") ||
      String(error.message || "").toLowerCase().includes("503") ||
      (error.code === 503) ||
      (error.status === "UNAVAILABLE");

    if (isDemandError) {
      return res.status(503).json({
        error: "현재 Gemini AI 모델에 일시적인 접속량이 매우 집중되고 있습니다. 자동 복구 재시도를 진행했으나 서버 지연 상태가 지속되었습니다. 2~3초 후 검색 버튼을 다시 눌러 주시면 정상 모델로 즉각 자동 재시도합니다!"
      });
    }

    return res.status(500).json({
      error: `사자성어 검색 도중 오류가 발생했습니다: ${error.message || error}`
    });
  }
});

// 단독 로컬 테스트 실행용 (Vercel 배포 시에는 수동 실행되지 않음)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[Hanja STUDY] Local Server running on port ${PORT}`);
  });
}

export default app;
