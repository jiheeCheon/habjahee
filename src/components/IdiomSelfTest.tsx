import React, { useState } from 'react';
import { BookOpen, Play, Check, Eye, ArrowLeft, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';
import { IdiomType, IdiomTestMode } from '../types';

interface IdiomSelfTestProps {
  savedIdioms: IdiomType[];
}

export default function IdiomSelfTest({ savedIdioms }: IdiomSelfTestProps) {
  const [selectedMode, setSelectedMode] = useState<IdiomTestMode>('meaning-to-idiom');
  const [questionLimit, setQuestionLimit] = useState<number | 'all'>('all');
  const [currentSessionCards, setCurrentSessionCards] = useState<{ idiom: IdiomType; promptType: 'idiom' | 'meaning' }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);

  if (savedIdioms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-8 shadow-[4px_4px_0px_#2C2C2C] text-center max-w-md mx-auto space-y-4 font-sans">
        <div className="w-16 h-16 bg-[#F2F1ED] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2C2C2C]">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#2C2C2C]">사자성어 셀프 테스트 불가능</h2>
        <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
          아직 학습할 사자성어가 보관함에 없습니다. <br />
          <strong>사자성어 검색 (AI 추천)</strong> 탭으로 이동해서 AI가 준비한 사자성어 카드를 추가해 주세요!
        </p>
      </div>
    );
  }

  const startTest = () => {
    // Shuffle saved idioms
    let shuffled = [...savedIdioms].sort(() => Math.random() - 0.5);
    
    // Slice if limit is a number
    if (typeof questionLimit === 'number') {
      shuffled = shuffled.slice(0, questionLimit);
    }
    
    const sessionData = shuffled.map((idiom) => {
      let promptType: 'idiom' | 'meaning' = 'idiom';
      
      if (selectedMode === 'meaning-to-idiom') {
        promptType = 'meaning'; // Show meaning, ask for idiom
      } else if (selectedMode === 'idiom-to-meaning') {
        promptType = 'idiom'; // Show idiom, ask for meaning
      } else {
        // Mixed/Random
        promptType = Math.random() > 0.5 ? 'idiom' : 'meaning';
      }

      return { idiom, promptType };
    });

    setCurrentSessionCards(sessionData);
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsTestRunning(true);
  };

  const handleNext = () => {
    if (currentIndex < currentSessionCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      // Finished
      setIsTestRunning(false);
    }
  };

  const currentCard = currentSessionCards[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      {!isTestRunning ? (
        /* Configuration Screen */
        <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 shadow-[4px_4px_0px_#2C2C2C] space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-[#2C2C2C] flex items-center justify-center gap-2">
              <Play className="w-5 h-5 text-[#2A5C55] fill-[#2A5C55]/20" />
              사자성어 주관식 셀프 테스트
            </h2>
            <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
              펜과 노트를 가져다 준비해 주세요! 화면에 나오는 설명이나 사자성어를 먼저 종이에 기록해 보고, 정답을 대조하며 집중력 높게 암기력을 테스트하는 자학자습 모드입니다.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#2C2C2C]/50 uppercase tracking-wider block">
              테스트 유형 및 질문 세트 선택
            </label>
            <div className="grid grid-cols-1 gap-3 font-sans">
              
              {/* Option 1: 뜻 보고 사자성어 생각하기 */}
              <button
                onClick={() => setSelectedMode('meaning-to-idiom')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'meaning-to-idiom'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">1. 뜻 보고 사자성어 생각하기</div>
                  <div className="text-[11px] opacity-70 mt-0.5 font-normal">
                    사자성어의 상세 뜻풀이를 보고, 머릿속이나 종이에 사자성어 한자 및 한글 독음을 생각합니다.
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === 'meaning-to-idiom' ? 'border-[#2A5C55] bg-[#2A5C55]' : 'border-slate-300'}`}>
                  {selectedMode === 'meaning-to-idiom' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </button>

              {/* Option 2: 사자성어 보고 뜻 맞추기 */}
              <button
                onClick={() => setSelectedMode('idiom-to-meaning')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'idiom-to-meaning'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">2. 사자성어 보고 뜻 맞추기</div>
                  <div className="text-[11px] opacity-70 mt-0.5 font-normal">
                    화면에 사자성어 한자가 제시되면, 어떤 훈음이나 의미 맥락을 뜻하는지 맞춥니다.
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === 'idiom-to-meaning' ? 'border-[#2A5C55] bg-[#2A5C55]' : 'border-slate-300'}`}>
                  {selectedMode === 'idiom-to-meaning' && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </button>

              {/* Option 3: 랜덤 */}
              <button
                onClick={() => setSelectedMode('mixed')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'mixed'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">3. 랜덤 혼합 모드</div>
                  <div className="text-[11px] opacity-70 mt-0.5 font-normal">
                    뜻 ➔ 사자성어 와 사자성어 ➔ 뜻 질문이 50% 확률로 무작위로 혼합 출제됩니다.
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMode === 'mixed' ? 'border-[#2A5C55] bg-[#2A5C55]' : 'border-slate-300'}`}>
                  {selectedMode === 'mixed' && <Check className="w-2.5 h-2.5 text-white" />}
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
            onClick={startTest}
            className="w-full py-4 bg-[#2A5C55] hover:bg-[#1e4641] text-white border-2 border-[#2C2C2C] rounded-xl font-black text-xs shadow-[3px_3px_0px_#2C2C2C] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            셀프 테스트 시험장 입장하기 ({typeof questionLimit === 'number' ? Math.min(questionLimit, savedIdioms.length) : savedIdioms.length}문항 준비)
          </button>
        </div>
      ) : (
        /* Test view running */
        <div className="space-y-6">
          
          {/* Header Progress panel */}
          <div className="bg-[#F2F1ED] border-2 border-[#2C2C2C] rounded-2xl p-4 flex justify-between items-center shadow-[3px_3px_0px_#2C2C2C]">
            <button
              onClick={() => setIsTestRunning(false)}
              className="flex items-center gap-1.5 text-xs font-black text-[#2C2C2C] hover:opacity-75 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" /> 중단하고 나가기
            </button>
            <span className="text-xs font-mono font-black text-[#2A5C55] bg-white border border-[#2C2C2C]/10 px-3 py-1 rounded-md">
              진행률: {currentIndex + 1} / {currentSessionCards.length}
            </span>
          </div>

          {/* Test Card Body */}
          <div className="bg-white border-2 border-[#2C2C2C] rounded-2xl p-8 shadow-[6px_6px_0px_#2C2C2C] flex flex-col justify-between min-h-[380px] space-y-6 text-center animate-fadeIn">
            
            {/* Meta header */}
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-mono">
              Q{currentIndex + 1}. {currentCard.promptType === 'meaning' ? "‘다음 뜻을 상징하는 사자성어는 무엇일까요?’" : "‘다음 사자성어의 주된 속뜻은 무엇일까요?’"}
            </span>

            {/* Prompt block core */}
            <div className="py-6 flex flex-col items-center justify-center">
              {currentCard.promptType === 'meaning' ? (
                /* Show korean description */
                <p className="text-lg md:text-xl font-black text-[#2C2C2C] max-w-md leading-relaxed font-sans px-4">
                  “ {currentCard.idiom.meaning} ”
                </p>
              ) : (
                /* Show characters */
                <div className="space-y-4">
                  <span className="text-4xl md:text-5xl font-serif font-black text-[#2C2C2C] tracking-widest select-none">
                    {currentCard.idiom.idiom}
                  </span>
                  <p className="text-xs text-[#2C2C2C]/50 font-sans tracking-wide">수첩의 기록이나 빈 노트에 정답을 써 마킹해 보세요.</p>
                </div>
              )}
            </div>

            {/* Answer Display Section */}
            {showAnswer ? (
              <div className="border-t-2 border-dashed border-[#2C2C2C]/20 pt-6 space-y-4 text-left animate-slideUp">
                <div className="bg-[#E7F3F1] border-2 border-[#2C2C2C] rounded-xl p-4 shadow-[2px_2px_0px_#2C2C2C]">
                  <span className="text-[10px] font-black text-[#2A5C55]/85 uppercase block mb-1">정답 개봉공란</span>
                  
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-serif font-black text-[#2C2C2C]">{currentCard.idiom.idiom}</span>
                    <span className="text-md font-bold text-[#2A5C55]">({currentCard.idiom.reading})</span>
                  </div>

                  <p className="text-xs text-[#2C2C2C] font-semibold mt-2 border-t border-[#2C2C2C]/10 pt-2 leading-relaxed">
                    <strong className="text-[#D44D44]">의미:</strong> {currentCard.idiom.meaning}
                  </p>

                  <p className="text-[11px] text-[#2C2C2C]/75 font-mono mt-1 leading-relaxed">
                    <strong className="text-[#2C2C2C]/70 font-sans">낱말 분석:</strong> {currentCard.idiom.literalMeaning}
                  </p>
                </div>

                {currentCard.idiom.tip && (
                  <div className="bg-[#FDFCF8] border border-[#2C2C2C]/20 rounded-xl p-3 text-[11px] leading-relaxed text-[#2C2C2C]/80 font-sans">
                    <span className="font-extrabold text-[#D44D44] block mb-0.5">💡 연상 기법</span>
                    <span>{currentCard.idiom.tip}</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-4 border-2 border-[#2C2C2C] bg-[#F2F1ED] text-[#2C2C2C] font-black text-xs rounded-xl hover:bg-white cursor-pointer active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_#2C2C2C] transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-[#D44D44]" /> 내가 생각한 정답 개봉하기
              </button>
            )}

            {/* Answer Control panel */}
            {showAnswer && (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-[#2C2C2C] text-white border-2 border-[#2C2C2C] rounded-xl font-black text-xs cursor-pointer active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:bg-[#3d3d3d] transition-all flex items-center justify-center gap-1"
              >
                {currentIndex < currentSessionCards.length - 1 ? "다음 문항 풀기" : "진한 피드백 종료"} <ChevronRight className="w-4 h-4 text-white" />
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
