export interface ExampleWord {
  word: string;        // 한자 단어 (e.g. "文明")
  reading: string;     // 한글 독음 (e.g. "문명")
  definition: string;  // 단어 뜻 (e.g. "인류가 이룩한 물질적, 기술적, 사회적 생활양식")
}

export interface HanjaType {
  id: string;               // Unique ID
  character: string;        // 한자 글자 (e.g. "明")
  meaning: string;          // 뜻 (e.g. "밝을")
  reading: string;          // 음 (e.g. "명")
  meaningReading: string;   // 훈음 결합 (e.g. "밝을 명")
  radical: string;          // 부수 (e.g. "日")
  radicalName: string;      // 부수명 (e.g. "날 일")
  strokeCount: number | string; // 획수 (e.g. 8)
  level: string;            // 급수 (e.g. "8급", "중급")
  exampleWords: ExampleWord[]; // 예시 단어들
  tip?: string;             // 암기 팁 / 설명
  createdAt: string;        // 생성 일시
}

export type QuizMode = 'hanja' | 'meaning' | 'random';

export interface QuizQuestion {
  hanja: HanjaType;
  promptType: 'hanja' | 'meaning'; // Show Hanja and ask for meaning, or vice-versa
  questionText: string;             // E.g., "明의 훈음(뜻과 음)은 무엇인가요?" or "‘밝을 명’에 해당하는 한자는?"
  options: string[];                // Choice options
  correctAnswer: string;            // Correct text option
}

export interface IdiomType {
  id: string;               // Unique ID
  idiom: string;            // 사자성어 한자 (e.g., "悠悠自適")
  reading: string;          // 한글 독음 (e.g., "유유자적")
  meaning: string;          // 뜻공략 풀이 (e.g., "속세를 떠나 아무 속박 없이 자기가 하고 싶은 대로 마음 편히 살아감")
  literalMeaning: string;   // 한자 직역 낱낱이 해설 (e.g., "悠(멀 유) 悠(멀 유) 自(스스로 자) 適(갈/편안할 적)")
  tip?: string;             // 암기 연상팁 / 이야기
  createdAt: string;        // 생성 일시
}

export type IdiomTestMode = 'meaning-to-idiom' | 'idiom-to-meaning' | 'mixed';

export interface IdiomQuizQuestion {
  idiom: IdiomType;
  promptType: 'idiom' | 'meaning'; // 'idiom': show representation, find meaning in Korean. 'meaning': show Korean meaning, find idiom in Chinese/Hangul.
  questionText: string;
  options: string[];
  correctAnswer: string;
}
