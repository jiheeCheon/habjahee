import React, { useState } from 'react';
import { Sparkles, Play, CheckCircle, XCircle, ArrowLeft, RotateCcw, Award } from 'lucide-react';
import { HanjaType, QuizMode, QuizQuestion } from '../types';

interface QuizTestProps {
  savedHanja: HanjaType[];
  onWrongAnswer: (hanja: HanjaType) => void;
}

// Resilient fallback pool of Hanja to generate options when saved hanjas are too few.
const FALLBACK_HANJA_POOL: { character: string; meaningReading: string }[] = [
  { character: '明', meaningReading: '밝을 명' },
  { character: '人', meaningReading: '사람 인' },
  { character: '大', meaningReading: '클 대' },
  { character: '小', meaningReading: '작을 소' },
  { character: '學', meaningReading: '배울 학' },
  { character: '校', meaningReading: '학교 교' },
  { character: '韓', meaningReading: '나라 한' },
  { character: '國', meaningReading: '나라 국' },
  { character: '日', meaningReading: '날 일' },
  { character: '月', meaningReading: '달 월' },
  { character: '水', meaningReading: '물 수' },
  { character: '火', meaningReading: '불 화' },
  { character: '山', meaningReading: '뫼 산' },
  { character: '木', meaningReading: '나무 목' },
  { character: '金', meaningReading: '쇠 금' },
  { character: '土', meaningReading: '흙 토' }
];

export default function QuizTest({ savedHanja, onWrongAnswer }: QuizTestProps) {
  const [selectedMode, setSelectedMode] = useState<QuizMode>('hanja');
  const [questionLimit, setQuestionLimit] = useState<number | 'all'>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [answersStatus, setAnswersStatus] = useState<{ question: QuizQuestion; isCorrect: boolean; userSelection: string }[]>([]);

  if (savedHanja.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-8 shadow-[4px_4px_0px_#2C2C2C] text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-[#F2F1ED] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2C2C2C]">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#2C2C2C]">객관식 퀴즈를 할 수 없습니다</h2>
        <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
          아직 퀴즈를 치를 한자가 보관함에 없습니다. <br />
          <strong>새 한자 검색</strong> 탭에서 먼저 학습할 한자들을 저장한 후 다시 방문해 주세요! (퀴즈에는 최소 1개 이상의 한자가 저장되어 있어야 합니다.)
        </p>
      </div>
    );
  }

  // Generates unique multiple choices for quiz questions
  const generateQuestions = () => {
    // Shuffled saved hanja to make questions
    let shuffledHanjas = [...savedHanja].sort(() => Math.random() - 0.5);
    
    // Slice if limit is a number
    if (typeof questionLimit === 'number') {
      shuffledHanjas = shuffledHanjas.slice(0, questionLimit);
    }

    const quizQuestions: QuizQuestion[] = shuffledHanjas.map((hanja) => {
      // Determine prompt type
      let promptType: 'hanja' | 'meaning' = 'hanja';
      if (selectedMode === 'hanja') {
        promptType = 'hanja';
      } else if (selectedMode === 'meaning') {
        promptType = 'meaning';
      } else {
        promptType = Math.random() > 0.5 ? 'hanja' : 'meaning';
      }

      const questionText =
        promptType === 'hanja'
          ? `‘ ${hanja.character} ’ 의 훈음(뜻과 음)은 무엇인가요?`
          : `‘ ${hanja.meaningReading} ’ 에 대응하는 한자는 무엇인가요?`;

      const correctAnswer = promptType === 'hanja' ? hanja.meaningReading : hanja.character;

      // Select other candidates from saved list or fallback pool to fill up to 4 choices
      const wrongList: string[] = [];

      if (promptType === 'hanja') {
        // Collect alternative meaningReadings
        const alternativeSaved = savedHanja
          .filter((h) => h.id !== hanja.id)
          .map((h) => h.meaningReading);
        const alternativeFallbacks = FALLBACK_HANJA_POOL.map((f) => f.meaningReading)
          .filter((mr) => mr !== hanja.meaningReading);

        const allAlternatives = Array.from(new Set([...alternativeSaved, ...alternativeFallbacks]));
        shuffledSlice(allAlternatives, 3).forEach((item) => wrongList.push(item));
      } else {
        // Collect alternative characters
        const alternativeSaved = savedHanja
          .filter((h) => h.id !== hanja.id)
          .map((h) => h.character);
        const alternativeFallbacks = FALLBACK_HANJA_POOL.map((f) => f.character)
          .filter((char) => char !== hanja.character);

        const allAlternatives = Array.from(new Set([...alternativeSaved, ...alternativeFallbacks]));
        shuffledSlice(allAlternatives, 3).forEach((item) => wrongList.push(item));
      }

      // Merge and shuffle options
      const options = [correctAnswer, ...wrongList].sort(() => Math.random() - 0.5);

      return {
        hanja,
        promptType,
        questionText,
        options,
        correctAnswer
      };
    });

    setQuestions(quizQuestions);
    setAnswersStatus([]);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsQuizRunning(true);
    setIsFinished(false);
  };

  // Safe helper to shuffle list and get slice
  function shuffledSlice<T>(arr: T[], limit: number): T[] {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, limit);
  }

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentIdx];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      // Wrong answer! Add to Incorrect Answer Note
      onWrongAnswer(currentQ.hanja);
    }

    setAnswersStatus((prev) => [
      ...prev,
      { question: currentQ, isCorrect, userSelection: option }
    ]);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {!isQuizRunning ? (
        /* Configuration Screen */
        <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 shadow-[4px_4px_0px_#2C2C2C] space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-[#2C2C2C] flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D44D44] fill-[#D44D44]/20" />
              스마트 4지선다 한자 퀴즈
            </h2>
            <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
              객관식 형태의 실력 점검 퀴즈입니다. 틀린 한자는 공부가 끝난 후 <strong>오답노트</strong>에 자동으로 인계되어 정밀 재학습이 열립니다.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#2C2C2C]/50 uppercase tracking-wider block">
              출제 형식 설정
            </label>
            <div className="grid grid-cols-1 gap-3 font-sans">
              <button
                onClick={() => setSelectedMode('hanja')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'hanja'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/10 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">1. 한자 출제형 (한자 ➔ 뜻 선택)</div>
                  <p className="text-[11px] opacity-75 mt-0.5 font-normal">한자가 화면에 대문짝만하게 나타나면 알맞은 뜻과 음(훈음)을 아래 보기에서 찾아냅니다.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'hanja' ? 'border-[#2C2C2C] bg-white' : 'border-[#2C2C2C]/30'}`}>
                  {selectedMode === 'hanja' && <div className="w-2.5 h-2.5 bg-[#D44D44] rounded-full" />}
                </div>
              </button>

              <button
                onClick={() => setSelectedMode('meaning')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'meaning'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/10 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">2. 뜻풀이 출제형 (뜻 ➔ 한자 선택)</div>
                  <p className="text-[11px] opacity-75 mt-0.5 font-normal">훈음(한국어)이 화면에 먼저 출제되면 그에 부합하는 정밀 한자 서체를 찾아 맞춥니다.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'meaning' ? 'border-[#2C2C2C] bg-white' : 'border-[#2C2C2C]/30'}`}>
                  {selectedMode === 'meaning' && <div className="w-2.5 h-2.5 bg-[#D44D44] rounded-full" />}
                </div>
              </button>

              <button
                onClick={() => setSelectedMode('random')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'random'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/10 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">3. 섞어섞어 무작위 출제형</div>
                  <p className="text-[11px] opacity-75 mt-0.5 font-normal">질문을 뜻풀이형과 한자형으로 골고루 교차 구성하여 입체적인 암기력을 촉진합니다.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'random' ? 'border-[#2C2C2C] bg-white' : 'border-[#2C2C2C]/30'}`}>
                  {selectedMode === 'random' && <div className="w-2.5 h-2.5 bg-[#D44D44] rounded-full" />}
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#2C2C2C]/50 uppercase tracking-wider block">
              출제 문항 수 설정 (10단위)
            </label>
            <div className="flex flex-wrap gap-2 font-sans text-xs">
              {([10, 20, 30, 40, 50, 'all'] as const).map((opt) => {
                const isSelected = questionLimit === opt;
                const label = opt === 'all' ? '전체' : `${opt}개`;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQuestionLimit(opt)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-black cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#2C2C2C] bg-[#2A5C55] text-white shadow-[2px_2px_0px_#2C2C2C]'
                        : 'border-[#2C2C2C]/10 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {typeof questionLimit === 'number' && savedHanja.length < questionLimit && (
              <p className="text-[10px] text-[#D44D44] font-semibold">
                * 보관된 한자가 {savedHanja.length}개이므로 {savedHanja.length}문항만 출제됩니다.
              </p>
            )}
          </div>

          <button
            onClick={generateQuestions}
            className="w-full py-4 bg-[#D44D44] border-2 border-[#2C2C2C] hover:bg-[#c23e35] text-white font-black rounded-xl shadow-[4px_4px_0px_#2C2C2C] cursor-pointer flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-none transition-all text-sm"
          >
            {typeof questionLimit === 'number' ? Math.min(questionLimit, savedHanja.length) : savedHanja.length}문항 퀴즈 생성 및 시작하기
          </button>
        </div>
      ) : isFinished ? (
        /* Quiz Summary Finish Screen */
        <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-8 shadow-[4px_4px_0px_#2C2C2C] space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-[#F2F1ED] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-full flex items-center justify-center shadow-[2px_2px_0px_#2C2C2C] animate-bounce">
            <Award className="w-10 h-10 text-[#D44D44]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#2C2C2C]">테스트 종료!</h2>
            <p className="text-xs text-[#2C2C2C]/60 font-sans">여러분의 소중한 한자 인지 능력 학습 결과 보고서입니다.</p>
          </div>

          <div className="bg-[#F2F1ED] rounded-2xl p-6 border-2 border-[#2C2C2C] flex justify-around items-center max-w-sm mx-auto shadow-[3px_3px_0px_#2C2C2C]">
            <div>
              <span className="text-[10px] font-bold text-[#2C2C2C]/50 uppercase font-mono">총 출제량</span>
              <div className="text-lg font-black text-[#2C2C2C] mt-0.5">{questions.length}개</div>
            </div>
            <div className="w-px h-8 bg-[#2C2C2C]/20" />
            <div>
              <span className="text-[10px] font-bold text-[#2C2C2C]/50 uppercase font-mono">맞친 문항수</span>
              <div className="text-lg font-black text-[#2A5C55] mt-0.5">{score}개</div>
            </div>
            <div className="w-px h-8 bg-[#2C2C2C]/20" />
            <div>
              <span className="text-[10px] font-bold text-[#2C2C2C]/50 uppercase font-mono">완료 합격률</span>
              <div className="text-lg font-black text-[#D44D44] mt-0.5">
                {Math.round((score / questions.length) * 100)}%
              </div>
            </div>
          </div>

          {/* Answer breakdown list */}
          <div className="text-left space-y-3 pt-2">
            <h3 className="text-[10px] font-black text-[#2C2C2C]/50 tracking-wider uppercase px-1">실시간 퀴즈 정답 결과 복기</h3>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin font-sans">
              {answersStatus.map((status, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between text-xs transition-all ${
                    status.isCorrect
                      ? 'bg-[#E7F3F1] border-[#2A5C55]/30 text-[#2A5C55]'
                      : 'bg-[#F9ECEB] border-[#D44D44]/30 text-[#D44D44]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="font-mono text-[10px] opacity-60">#{index + 1}</span>
                      <span className="font-serif font-black text-sm">{status.question.hanja.character}</span>
                      <span className="opacity-90">({status.question.hanja.meaningReading})</span>
                    </div>
                    <div className="text-[10px] opacity-80 mt-1 pl-5">
                      내가 고른 문항: <span className="font-bold underline italic">{status.userSelection}</span>
                    </div>
                  </div>
                  {status.isCorrect ? (
                    <span className="text-[10px] text-[#2A5C55] font-black bg-white border border-[#2A5C55]/30 px-2.5 py-0.5 rounded shadow-sm">정답</span>
                  ) : (
                    <span className="text-[10px] text-[#D44D44] font-black bg-white border border-[#D44D44]/30 px-2.5 py-0.5 rounded shadow-sm">오답 인계됨</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsQuizRunning(false)}
              className="flex-1 py-3 bg-[#F2F1ED] hover:bg-white text-[#2C2C2C] font-black rounded-xl border-2 border-[#2C2C2C] shadow-[2px_2px_0px_#2C2C2C] active:translate-y-0.5 active:shadow-none transition-all text-xs font-sans"
            >
              종료하고 나가기
            </button>
            <button
              onClick={generateQuestions}
              className="flex-1 py-3 bg-[#2C2C2C] text-[#FDFCF8] font-black rounded-xl border-2 border-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:bg-black transition-all text-xs flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> 다시 도전하기
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Screen */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setIsQuizRunning(false)}
              className="text-xs text-[#2C2C2C]/60 hover:text-[#D44D44] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 중단하고 나가기
            </button>
            <span className="text-[11px] font-mono text-[#2C2C2C] bg-[#F2F1ED] border-2 border-[#2C2C2C] px-3 py-1 rounded-xl">
              퀴즈 {currentIdx + 1} / {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-white border-2 border-[#2C2C2C] rounded-full overflow-hidden shadow-[2px_2px_0px_#2C2C2C]">
            <div
              className="h-full bg-[#2A5C55] transition-all duration-350"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question display card */}
          <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] shadow-[4px_4px_0px_#2C2C2C] p-6 space-y-6">
            <div className="bg-[#FDFCF8] border-2 border-[#2C2C2C] rounded-2xl p-6 text-center space-y-4 shadow-[2px_2px_0px_rgba(0,0,0,0.04)]">
              <span className="text-[10px] font-bold text-[#2C2C2C]/40 uppercase tracking-widest font-mono">문항 {currentIdx + 1}</span>
              <h3 className="text-base font-black text-[#2C2C2C] font-sans px-2 leading-relaxed">
                {currentQuestion.questionText}
              </h3>
              
              <div className="flex items-center justify-center">
                {currentQuestion.promptType === 'hanja' ? (
                  <div className="text-8xl font-serif font-black text-[#2C2C2C] p-2 tracking-widest select-none leading-none filter drop-shadow-sm">
                    {currentQuestion.hanja.character}
                  </div>
                ) : (
                  <div className="text-2xl font-black text-[#2C2C2C] font-sans py-4 tracking-tight leading-relaxed">
                    “ {currentQuestion.hanja.meaningReading} ”
                  </div>
                )}
              </div>
            </div>

            {/* Answer option buttons in Neo Brutalism style */}
            <div className="grid grid-cols-1 gap-3 font-sans">
              {currentQuestion.options.map((option, oIdx) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;

                let btnStyles = 'border-2 border-[#2C2C2C] bg-white hover:bg-[#F2F1ED] text-[#2C2C2C] font-bold shadow-[2px_2px_0px_#2C2C2C] active:translate-y-0.5 active:shadow-none';
                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyles = 'border-2 border-[#2A5C55] bg-[#E7F3F1] text-[#2A5C55] font-black ring-4 ring-[#2A5C55]/15';
                  } else if (isSelected) {
                    btnStyles = 'border-2 border-[#D44D44] bg-[#F9ECEB] text-[#D44D44] font-black ring-4 ring-[#D44D44]/15';
                  } else {
                    btnStyles = 'border-2 border-[#2C2C2C]/10 opacity-35 bg-[#FDFCF8] text-[#2C2C2C]/40 pointer-events-none';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(option)}
                    className={`p-4 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyles}`}
                  >
                    <span className="font-bold flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-45">{oIdx + 1}.</span>
                      {option}
                    </span>
                    {isAnswered && isCorrectOption && (
                      <CheckCircle className="w-4.5 h-4.5 text-[#2A5C55] flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-4.5 h-4.5 text-[#D44D44] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic visual explanations on answered code */}
            {isAnswered && (
              <div className="bg-[#F2F1ED] p-4 rounded-xl border-2 border-[#2C2C2C] transition-all font-sans text-xs space-y-2 shadow-[2px_2px_0px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-1">
                  💡 <span className="font-black text-[#2C2C2C]">AI 명품 해설: </span>
                  <p className="text-[#2C2C2C]/80 leading-relaxed font-sans inline">
                    <strong className="text-black font-serif text-sm">{currentQuestion.hanja.character}</strong>는(은) <strong>{currentQuestion.hanja.meaningReading}</strong>입니다. 부수는 <strong>{currentQuestion.hanja.radical} ({currentQuestion.hanja.radicalName})</strong>이며, 총 <strong>{currentQuestion.hanja.strokeCount}획</strong>으로 구성됩니다.
                  </p>
                </div>
                {currentQuestion.hanja.tip && (
                  <p className="text-[#2C2C2C]/60 italic font-sans leading-relaxed pl-5 font-semibold">"{currentQuestion.hanja.tip}"</p>
                )}
              </div>
            )}

            {/* Next Problem trigger */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-[#2C2C2C] hover:bg-black text-[#FDFCF8] border-2 border-[#2C2C2C] font-black rounded-xl cursor-pointer shadow-[3px_3px_0px_#2C2C2C] active:translate-y-0.5 active:shadow-none transition-all font-sans text-xs"
              >
                {currentIdx === questions.length - 1 ? '전체 결과 도출 해보기' : '다음 문항 넘어가기'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
