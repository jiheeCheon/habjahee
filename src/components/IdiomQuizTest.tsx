import React, { useState } from 'react';
import { Sparkles, Play, CheckCircle, XCircle, ArrowLeft, RotateCcw, Award } from 'lucide-react';
import { IdiomType, IdiomQuizQuestion, IdiomTestMode } from '../types';

interface IdiomQuizTestProps {
  savedIdioms: IdiomType[];
  onWrongAnswer?: (idiom: IdiomType) => void;
}

const FALLBACK_IDIOM_POOL: { idiom: string; reading: string; meaning: string }[] = [
  { idiom: '悠悠自適', reading: '유유자적', meaning: '속세를 떠나 아무 속박 없이 제멋대로 여유롭게 살아감' },
  { idiom: '膠漆之交', reading: '교칠지교', meaning: '아주 친밀하여 떨어질 수 없는 두터운 우정' },
  { idiom: '切齒腐心', reading: '절치부심', meaning: '이를 갈고 속을 썩이며 복수나 성공을 수년 동안 벼름' },
  { idiom: '臥薪嘗膽', reading: '와신상담', meaning: '원수를 갚거나 집념을 이루고자 온갖 고난을 참고 견딤' },
  { idiom: '溫故知新', reading: '온고지신', meaning: '옛것을 충분히 학습하고 깊게 익히며 새로운 깨우침을 앎' },
  { idiom: '孤立無援', reading: '고립무원', meaning: '사방이 막히고 홀로 고립되어 전혀 구원이나 도움을 얻을 수 없음' },
  { idiom: '多才多능', reading: '다재다능', meaning: '보유한 재능과 기예가 상당히 많고 다채로운 방면에 능통함' },
  { idiom: '一場春夢', reading: '일장춘몽', meaning: '한바탕 흐드러지게 핀 봄날의 꿈처럼 허무하고 부질없는 일장사' },
  { idiom: '愚公移山', reading: '우공이산', meaning: '아무리 험난한 고개도 쉬지 않고 우직하게 나아가면 산을 옮김' },
  { idiom: '以心傳心', reading: '이심전심', meaning: '따로 글을 적거나 말하지 않아도 마음과 마음이 깊게 통함' },
  { idiom: '四面楚歌', reading: '사면초가', meaning: '온 세상이 모두 적대세력으로 에워싸여 고립무원하고 구원을 바랄 수 없음' },
  { idiom: '槿花一夢', reading: '근화일몽', meaning: '덧없는 인간 세상의 영광과 잠시 머무는 화려한 부귀' }
];

export default function IdiomQuizTest({ savedIdioms, onWrongAnswer }: IdiomQuizTestProps) {
  const [selectedMode, setSelectedMode] = useState<IdiomTestMode>('meaning-to-idiom');
  const [questionLimit, setQuestionLimit] = useState<number | 'all'>('all');
  const [questions, setQuestions] = useState<IdiomQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [report, setReport] = useState<{ question: IdiomQuizQuestion; isCorrect: boolean; userSelection: string }[]>([]);

  if (savedIdioms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-8 shadow-[4px_4px_0px_#2C2C2C] text-center max-w-md mx-auto space-y-4 font-sans">
        <div className="w-16 h-16 bg-[#F2F1ED] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2C2C2C]">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#2C2C2C]">사자성어 객관식 퀴즈 불가능</h2>
        <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
          아직 퀴즈에 출제할 사자성어가 내 수첩에 단 하나도 없습니다. <br />
          <strong>사자성어 검색</strong> 탭을 클릭하여 마음에 드는 사자성어를 먼저 등록해 주세요!
        </p>
      </div>
    );
  }

  // Helper code to pick random items
  const shuffleSlice = <T,>(arr: T[], limit: number): T[] => {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, limit);
  };

  const startQuiz = () => {
    // Generate questions from savedIdioms (shuffled)
    let shuffledIdioms = [...savedIdioms].sort(() => Math.random() - 0.5);
    
    // Slice if limit is a number
    if (typeof questionLimit === 'number') {
      shuffledIdioms = shuffledIdioms.slice(0, questionLimit);
    }

    const quizQuestions: IdiomQuizQuestion[] = shuffledIdioms.map((idiom) => {
      let promptType: 'idiom' | 'meaning' = 'idiom';
      
      if (selectedMode === 'meaning-to-idiom') {
        promptType = 'meaning'; // Show meaning definition, user picks Correct Idiom characters/reading
      } else if (selectedMode === 'idiom-to-meaning') {
        promptType = 'idiom'; // Show Idiom characters/reading, user picks Meaning definition
      } else {
        promptType = Math.random() > 0.5 ? 'idiom' : 'meaning';
      }

      const questionText =
        promptType === 'meaning'
          ? `‘ ${idiom.meaning} ’ 뜻에 해당하는 알맞은 사자성어는 무엇인가요?`
          : `사자성어 ‘ ${idiom.idiom} (${idiom.reading}) ’ 의 한국어 뜻말로 올바른 것은 무엇인가요?`;

      const correctAnswer =
        promptType === 'meaning'
          ? `${idiom.idiom} (${idiom.reading})`
          : idiom.meaning;

      const wrongList: string[] = [];

      if (promptType === 'meaning') {
        // Find alternative idioms
        const alternativeSaved = savedIdioms
          .filter((i) => i.id !== idiom.id)
          .map((i) => `${i.idiom} (${i.reading})`);
        const alternativeFallbacks = FALLBACK_IDIOM_POOL
          .filter((f) => f.idiom !== idiom.idiom)
          .map((f) => `${f.idiom} (${f.reading})`);

        // De-duplicate alternate options
        const allAlternatives = Array.from(new Set([...alternativeSaved, ...alternativeFallbacks]));
        shuffleSlice(allAlternatives, 3).forEach((item) => wrongList.push(item));
      } else {
        // Find alternative meanings
        const alternativeSaved = savedIdioms
          .filter((i) => i.id !== idiom.id)
          .map((i) => i.meaning);
        const alternativeFallbacks = FALLBACK_IDIOM_POOL
          .filter((f) => f.idiom !== idiom.idiom)
          .map((f) => f.meaning);

        const allAlternatives = Array.from(new Set([...alternativeSaved, ...alternativeFallbacks]));
        shuffleSlice(allAlternatives, 3).forEach((item) => wrongList.push(item));
      }

      // If we don't have enough options, add some hardcoded strings
      while (wrongList.length < 3) {
        wrongList.push("알 수 없는 뜻이나 잘못 설정된 지문입니다.");
      }

      const options = [correctAnswer, ...wrongList].sort(() => Math.random() - 0.5);

      return {
        idiom,
        promptType,
        questionText,
        options,
        correctAnswer
      };
    });

    setQuestions(quizQuestions);
    setReport([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizRunning(true);
    setIsFinished(false);
  };

  const submitOption = (chosen: string) => {
    if (isAnswered) return;
    setSelectedOption(chosen);
    setIsAnswered(true);

    const question = questions[currentIndex];
    const isCorrect = chosen === question.correctAnswer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      // Trigger optional callback for incorrect tracking if supplied
      if (onWrongAnswer) {
        onWrongAnswer(question.idiom);
      }
    }

    setReport((prev) => [
      ...prev,
      {
        question,
        isCorrect,
        userSelection: chosen
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const activeQuestion = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      {!isQuizRunning && !isFinished ? (
        /* 1. CONFIG SELECTOR SCREEN */
        <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 shadow-[4px_4px_0px_#2C2C2C] space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-[#2C2C2C] flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2A5C55] fill-[#2A5C55]/20" />
              사자성어 객관식 맞추기 대교실
            </h2>
            <p className="text-xs text-[#2C2C2C]/65 font-sans leading-relaxed">
              오지선다 및 사지선다를 풀어 보며 학습 성취도를 정확하게 판별해 드립니다. 오답으로 체크한 문제는 한자 오답 노트와 맞물려 복습할 수 있게 실시간 수록 연동됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#2C2C2C]/50 uppercase tracking-wider block">
              지문 출제 포맷 설정
            </label>
            <div className="grid grid-cols-1 gap-3 font-sans">
              
              {/* Option 1 */}
              <button
                onClick={() => setSelectedMode('meaning-to-idiom')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'meaning-to-idiom'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">1. 한국어 뜻 보고 사자성어 맞추기</div>
                  <div className="text-[11px] opacity-70 mt-0.5 font-normal">
                    문제로 뜻풀이가 주어지면, 올바른 사자성어 명칭(한자+독음) 후보를 객관식 지문에서 지목합니다.
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === 'meaning-to-idiom' ? 'border-[#2A5C55] bg-[#2A5C55]' : 'border-slate-300'}`}>
                  {selectedMode === 'meaning-to-idiom' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              {/* Option 2 */}
              <button
                onClick={() => setSelectedMode('idiom-to-meaning')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'idiom-to-meaning'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">2. 사자성어 제시 후 한국어 뜻 맞추기</div>
                  <div className="text-[11px] opacity-70 mt-0.5 font-normal">
                    문제로 사자성어가 한자로 나타나면, 올바른 한글 속뜻 후보를 4지선다에서 올바르게 선택합니다.
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === 'idiom-to-meaning' ? 'border-[#2A5C55] bg-[#2A5C55]' : 'border-slate-300'}`}>
                  {selectedMode === 'idiom-to-meaning' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              {/* Option 3 */}
              <button
                onClick={() => setSelectedMode('mixed')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'mixed'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">3. 뜻 ↔ 사자성어 무작위 혼합 출제</div>
                  <div className="text-[11px] opacity-70 mt-0.5 font-normal">
                    지문 포맷이 무작위로 양방향 교체 출제되어 실전 극상의 학업 성휘를 제공합니다.
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === 'mixed' ? 'border-[#2A5C55] bg-[#2A5C55]' : 'border-slate-300'}`}>
                  {selectedMode === 'mixed' && <div className="w-2 h-2 rounded-full bg-white" />}
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
            {typeof questionLimit === 'number' && savedIdioms.length < questionLimit && (
              <p className="text-[10px] text-[#D44D44] font-semibold">
                * 보관된 사자성어가 {savedIdioms.length}개이므로 {savedIdioms.length}문항만 출제됩니다.
              </p>
            )}
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-4 bg-[#2A5C55] hover:bg-[#1e4641] text-white border-2 border-[#2C2C2C] rounded-xl font-black text-xs shadow-[3px_3px_0px_#2C2C2C] hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            퀴즈 시험장 입장 ({typeof questionLimit === 'number' ? Math.min(questionLimit, savedIdioms.length) : savedIdioms.length}문항 자동 설계)
          </button>
        </div>
      ) : isQuizRunning && !isFinished ? (
        /* 2. QUIZ IN-PROGRESS VIEW */
        <div className="space-y-6">
          {/* Progress Board */}
          <div className="bg-[#F2F1ED] border-2 border-[#2C2C2C] rounded-2xl p-4 flex justify-between items-center shadow-[3px_3px_0px_#2C2C2C]">
            <button
              onClick={() => {
                if (confirm("시험을 중단하고 나가시겠습니까? 진행 기록은 버려집니다.")) {
                  setIsQuizRunning(false);
                }
              }}
              className="flex items-center gap-1.5 text-xs font-black text-[#2C2C2C] hover:opacity-75"
            >
              <ArrowLeft className="w-4 h-4" /> 포기하고 퇴실
            </button>
            <div className="flex gap-3">
              <span className="text-xs font-bold text-[#2A5C55]">맞춤: {score}개</span>
              <span className="text-xs font-mono font-black text-[#2A5C55] bg-white border border-[#2C2C2C]/10 px-2.5 py-1 rounded">
                문항: {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>

          {/* Active Question Panel */}
          <div className="bg-white border-2 border-[#2C2C2C] rounded-2xl p-6 md:p-8 shadow-[4px_4px_0px_#2C2C2C] space-y-6 animate-fadeIn">
            
            {/* Subject prompt text */}
            <div className="text-center py-4 space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                QUESTION {currentIndex + 1} OF {questions.length}
              </span>
              <h3 className="text-md md:text-xl font-black text-[#2C2C2C] max-w-lg mx-auto leading-relaxed">
                {activeQuestion.questionText}
              </h3>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 gap-3.5">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isThisCorrect = opt === activeQuestion.correctAnswer;
                
                // Color formatting based on correction feedback
                let btnStyle = "border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]";
                if (isAnswered) {
                  if (isThisCorrect) {
                    btnStyle = "border-[#2A5C55] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]";
                  } else if (isSelected) {
                    btnStyle = "border-[#D44D44] bg-[#F9ECEB] text-[#D44D44] font-black shadow-[2px_2px_0px_#2C2C2C]";
                  } else {
                    btnStyle = "border-[#2C2C2C]/10 opacity-40 text-[#2C2C2C]";
                  }
                } else if (isSelected) {
                  btnStyle = "border-[#2C2C2C] bg-[#2C2C2C] text-white font-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)]";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => submitOption(opt)}
                    className={`w-full p-4 rounded-xl border-2 text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span className="leading-relaxed font-semibold">{opt}</span>
                    
                    {isAnswered && (
                      <span className="flex-shrink-0 ml-2">
                        {isThisCorrect ? (
                          <CheckCircle className="w-5 h-5 text-[#2A5C55] fill-[#2A5C55]/10" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-[#D44D44] fill-[#D44D44]/10" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint mnemonic revealed immediately on incorrect answer to strengthen recollection */}
            {isAnswered && (
              <div className="bg-[#FDFCF8] border-2 border-dashed border-[#2C2C2C]/20 rounded-xl p-4 animate-slideUp text-xs space-y-2">
                <p className="text-slate-700 leading-relaxed font-medium">
                  💡 <strong>정답 풀이:</strong> {activeQuestion.idiom.idiom} ({activeQuestion.idiom.reading}) - 명품 속뜻: <i>{activeQuestion.idiom.meaning}</i>
                </p>
                {activeQuestion.idiom.tip && (
                  <p className="text-[11px] text-[#2C2C2C]/70 leading-relaxed font-sans mt-1">
                    └ <strong>연상 기법:</strong> {activeQuestion.idiom.tip}
                  </p>
                )}
              </div>
            )}

            {/* Action Bottom command button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-[#2C2C2C] hover:bg-[#3d3d3d] text-white border-2 border-[#2C2C2C] rounded-xl font-black text-xs cursor-pointer active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-1"
              >
                {currentIndex < questions.length - 1 ? "다음 문제 풀기" : "시험지 성적 제출하기"}
              </button>
            )}

          </div>
        </div>
      ) : (
        /* 3. REPORT EXCELLENT SCOREBOARD CARD */
        <div className="bg-white border-2 border-[#2C2C2C] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_#2C2C2C] space-y-6 animate-fadeIn">
          <div className="text-center space-y-3 font-sans">
            <div className="w-16 h-16 bg-[#E7F3F1] border-2 border-[#2C2C2C] text-[#2A5C55] rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0px_#2C2C2C]">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#2C2C2C] tracking-tight">수고하셨습니다! 성석표 발행 완료</h2>
              <p className="text-xs text-[#2C2C2C]/60">총 {questions.length}문제 중 {score}문제를 정답으로 맞추어 마침표를 찍었습니다.</p>
            </div>

            {/* Score display block with Neo badge */}
            <div className="inline-block bg-[#F9ECEB] text-[#D44D44] border-2 border-[#2C2C2C] rounded-full px-6 py-2 shadow-[2px_2px_0px_#2C2C2C] text-sm font-black font-mono">
              학습 점수: {Math.round((score / questions.length) * 100)}점
            </div>
          </div>

          <div className="border-t-2 border-[#2C2C2C]/10 pt-5 space-y-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">문항 분석 레포트</h4>
            
            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 font-sans">
              {report.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs font-semibold ${
                    item.isCorrect
                      ? 'bg-[#E7F3F1]/40 border-[#2A5C55]/25 text-[#2C2C2C]'
                      : 'bg-[#F9ECEB]/30 border-[#D44D44]/25 text-[#2C2C2C]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="font-serif text-[#2C2C2C] text-sm">{item.question.idiom.idiom}</span>
                      <span className="text-[11px] opacity-75">({item.question.idiom.reading})</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5 max-w-[400px] truncate">
                      {item.question.promptType === 'meaning' ? `의미 ➔ 사자성어 질문` : `사자성어 ➔ 의미 질문`}
                    </p>
                  </div>

                  <span className="flexitems-center gap-1 text-[11px] font-black">
                    {item.isCorrect ? (
                      <span className="text-[#2A5C55]">정답수록</span>
                    ) : (
                      <span className="text-[#D44D44]">오답오인</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setIsQuizRunning(false);
              setIsFinished(false);
            }}
            className="w-full py-4 bg-[#2C2C2C] text-white border-2 border-[#2C2C2C] rounded-xl font-black text-xs cursor-pointer active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0px_rgba(0,0,0,0.15)] flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4 text-white" /> 퀴즈 다시 치러 가기
          </button>
        </div>
      )}
    </div>
  );
}
