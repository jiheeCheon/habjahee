import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, ChevronRight, Eye, Play, Sparkles, Check, HelpCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { HanjaType } from '../types';

interface SelfTestProps {
  savedHanja: HanjaType[];
}

type SelfTestMode = 'hanja-only' | 'meaning-only' | 'mixed';

export default function SelfTest({ savedHanja }: SelfTestProps) {
  const [selectedMode, setSelectedMode] = useState<SelfTestMode>('hanja-only');
  const [questionLimit, setQuestionLimit] = useState<number | 'all'>('all');
  const [currentSessionCards, setCurrentSessionCards] = useState<{ hanja: HanjaType; promptType: 'hanja' | 'meaning' }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);

  if (savedHanja.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-8 shadow-[4px_4px_0px_#2C2C2C] text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-[#F2F1ED] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2C2C2C]">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#2C2C2C]">셀프 테스트를 진행할 수 없습니다</h2>
        <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
          아직 학습할 한자가 보관함에 없습니다. <br />
          <strong>새 한자 검색</strong> 탭으로 이동해서 AI가 준비한 한자 카드를 추가해 주세요!
        </p>
      </div>
    );
  }

  const startTest = () => {
    // Generate session cards from savedHanja
    // Shuffle the cards
    let shuffled = [...savedHanja].sort(() => Math.random() - 0.5);
    
    // Slice if limit is a number
    if (typeof questionLimit === 'number') {
      shuffled = shuffled.slice(0, questionLimit);
    }
    
    const sessionData = shuffled.map((hanja) => {
      let promptType: 'hanja' | 'meaning' = 'hanja';
      
      if (selectedMode === 'hanja-only') {
        promptType = 'hanja';
      } else if (selectedMode === 'meaning-only') {
        promptType = 'meaning';
      } else {
        // Mixed
        promptType = Math.random() > 0.5 ? 'hanja' : 'meaning';
      }

      return { hanja, promptType };
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
    <div className="max-w-xl mx-auto space-y-6">
      {!isTestRunning ? (
        /* Configuration Screen */
        <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 shadow-[4px_4px_0px_#2C2C2C] space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-[#2C2C2C] flex items-center justify-center gap-2">
              <Play className="w-5 h-5 text-[#D44D44] fill-[#D44D44]/20" />
              한자 자가 진단 셀프 테스트
            </h2>
            <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
              노트와 연필을 준비해 주세요! 화면의 한자나 뜻을 보고, 개인 공책에 먼저 써본 뒤 뜻풀이와 대조하는 아날로그 맞춤형 자가 시험 모드입니다.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#2C2C2C]/50 uppercase tracking-wider block">
              테스트 유형 설정
            </label>
            <div className="grid grid-cols-1 gap-3 font-sans">
              <button
                onClick={() => setSelectedMode('hanja-only')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'hanja-only'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">1. 한자 제시 모드</div>
                  <p className="text-[11px] opacity-75 mt-0.5 font-normal">한자가 먼저 나타나고, 그 한자의 음과 뜻을 작성해 봅니다.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'hanja-only' ? 'border-[#2C2C2C] bg-white' : 'border-[#2C2C2C]/30'}`}>
                  {selectedMode === 'hanja-only' && <div className="w-2.5 h-2.5 bg-[#D44D44] rounded-full" />}
                </div>
              </button>

              <button
                onClick={() => setSelectedMode('meaning-only')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'meaning-only'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">2. 훈음 제시 펜기록 모드</div>
                  <p className="text-[11px] opacity-75 mt-0.5 font-normal">훈음(뜻과 음)이 먼저 나타나고, 종이에 해당하는 한자를 올바르게 씁니다.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'meaning-only' ? 'border-[#2C2C2C] bg-white' : 'border-[#2C2C2C]/30'}`}>
                  {selectedMode === 'meaning-only' && <div className="w-2.5 h-2.5 bg-[#D44D44] rounded-full" />}
                </div>
              </button>

              <button
                onClick={() => setSelectedMode('mixed')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedMode === 'mixed'
                    ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                    : 'border-[#2C2C2C]/20 hover:bg-[#F2F1ED] text-[#2C2C2C]'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">3. 한자 + 훈음 랜덤 혼합 모드</div>
                  <p className="text-[11px] opacity-75 mt-0.5 font-normal">한자와 뜻풀이가 마구 뒤섞여 고강도의 교차 학습 효과를 볼 수 있습니다.</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMode === 'mixed' ? 'border-[#2C2C2C] bg-white' : 'border-[#2C2C2C]/30'}`}>
                  {selectedMode === 'mixed' && <div className="w-2.5 h-2.5 bg-[#D44D44] rounded-full" />}
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

          <div className="bg-[#F2F1ED] border-2 border-[#2C2C2C] rounded-xl p-4 text-center text-xs text-[#2C2C2C] font-semibold shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
            보관함 속 명품 한자 중 <strong className="text-[#D44D44] font-bold">{typeof questionLimit === 'number' ? Math.min(questionLimit, savedHanja.length) : savedHanja.length}개</strong>로 뒤섞인 자가 테스트를 시작합니다.
          </div>

          <button
            onClick={startTest}
            className="w-full py-4 bg-[#D44D44] hover:bg-[#c23e35] text-white border-2 border-[#2C2C2C] font-black rounded-xl shadow-[4px_4px_0px_#2C2C2C] cursor-pointer flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none transition-all text-sm"
          >
            <Sparkles className="w-5 h-5" />
            테스트 시작하기
          </button>
        </div>
      ) : (
        /* Running Quiz Screen */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setIsTestRunning(false)}
              className="text-xs text-[#2C2C2C]/60 hover:text-[#D44D44] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 뒤로 돌아가기
            </button>
            <span className="text-[11px] font-mono text-[#2C2C2C] bg-[#F2F1ED] border-2 border-[#2C2C2C] px-3 py-1 rounded-xl">
              카드 {currentIndex + 1} / {currentSessionCards.length}
            </span>
          </div>

          {/* Progress bar in brutal bento style */}
          <div className="w-full h-4 bg-white border-2 border-[#2C2C2C] rounded-full overflow-hidden shadow-[2px_2px_0px_#2C2C2C]">
            <div
              className="h-full bg-[#2A5C55] transition-all duration-350"
              style={{ width: `${((currentIndex + 1) / currentSessionCards.length) * 100}%` }}
            />
          </div>

          {/* Test Main Visual Card */}
          <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] shadow-[4px_4px_0px_#2C2C2C] p-8 min-h-[300px] flex flex-col justify-between items-center text-center">
            {/* Context type signifier */}
            <span className="text-xs font-black text-[#2A5C55] bg-[#E7F3F1] border border-[#2C2C2C]/30 px-3.5 py-1.5 rounded-full font-sans shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.06)]">
              {currentCard.promptType === 'hanja' ? '👉 제시된 한자를 읽고 해당하는 훈음(뜻/음)을 맞혀보세요' : '👉 뜻풀이를 읽고 종이에 해당하는 한자를 올바르게 써보세요'}
            </span>

            {/* Prompt character/meaning display */}
            <div className="my-6">
              {currentCard.promptType === 'hanja' ? (
                <div className="text-8xl font-serif font-black text-[#2C2C2C] border-none select-none tracking-wide">
                  {currentCard.hanja.character}
                </div>
              ) : (
                <div className="text-3xl font-black text-[#2C2C2C] font-sans tracking-tight">
                  {currentCard.hanja.meaningReading}
                </div>
              )}
              <span className="text-[10px] text-[#2C2C2C]/50 font-mono block mt-4 font-sans tracking-widest uppercase">
                {currentCard.hanja.level} • {currentCard.hanja.strokeCount} STROKES
              </span>
            </div>

            {/* Answer Reveals */}
            <div className="w-full space-y-4">
              {showAnswer ? (
                /* Detail answers view */
                <div className="bg-[#FDFCF8] border-2 border-[#2C2C2C] rounded-xl p-5 text-left font-sans animate-fadeIn shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
                  <div className="text-center mb-4 pb-3 border-b-2 border-[#2C2C2C]/10">
                    <span className="text-[10px] font-bold text-[#2C2C2C]/40 uppercase font-mono">정답 결과</span>
                    <div className="text-3xl font-serif font-black text-[#2C2C2C] mt-1">{currentCard.hanja.character}</div>
                    <div className="text-base font-black text-[#D44D44] mt-1">{currentCard.hanja.meaningReading} <span className="text-xs text-[#2C2C2C]/60 font-medium">(부수: {currentCard.hanja.radical})</span></div>
                  </div>

                  {currentCard.hanja.tip && (
                    <div className="bg-[#F2F1ED] border-2 border-[#2C2C2C] rounded-lg p-2.5 text-[11px] text-[#2C2C2C] mb-3">
                      <span className="font-extrabold block mb-0.5 font-sans text-[#D44D44]">💡 암기 연상팁</span>
                      <span>{currentCard.hanja.tip}</span>
                    </div>
                  )}

                  {currentCard.hanja.exampleWords && currentCard.hanja.exampleWords.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-wider block">실생활 활용 단어</span>
                      {currentCard.hanja.exampleWords.map((word, idx) => (
                        <div key={idx} className="text-xs font-medium text-[#2C2C2C] bg-white border border-[#2C2C2C]/25 rounded p-1.5 font-mono">
                          <strong className="text-[#2A5C55] font-sans">{word.word} ({word.reading})</strong>: <span className="opacity-80 font-sans">{word.definition}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Reveal CTA */
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 border-2 border-dashed border-[#2C2C2C] bg-[#F2F1ED]/50 hover:bg-[#F2F1ED] rounded-xl font-bold text-[#2C2C2C] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <Eye className="w-4.5 h-4.5 text-[#D44D44]" /> 내가 생각한 정답 개봉하기
                </button>
              )}

              {/* Interaction Next button */}
              {showAnswer && (
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-[#2C2C2C] border-2 border-[#2C2C2C] text-[#FDFCF8] hover:bg-black font-black rounded-xl shadow-[3px_3px_0px_#2C2C2C] cursor-pointer flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  {currentIndex === currentSessionCards.length - 1 ? '테스트 진단 마무리 완료' : '다음 정답 맞추기'}
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
