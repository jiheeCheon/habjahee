import React, { useState } from 'react';
import { Award, BookOpen, Trash2, ArrowRight, CheckCircle, RefreshCw, Sparkles, Star } from 'lucide-react';
import { HanjaType } from '../types';

interface IncorrectNoteProps {
  incorrectHanjaIds: string[];
  savedHanja: HanjaType[];
  onRemoveFromIncorrect: (id: string) => void;
  onClearAllIncorrect: () => void;
}

export default function IncorrectNote({
  incorrectHanjaIds,
  savedHanja,
  onRemoveFromIncorrect,
  onClearAllIncorrect
}: IncorrectNoteProps) {
  const [selectedHanjaId, setSelectedHanjaId] = useState<string | null>(null);

  // Filter actual hanja objects currently matching the index list
  const incorrectHanjas = savedHanja.filter((h) => incorrectHanjaIds.includes(h.id));

  if (incorrectHanjas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-8 shadow-[4px_4px_0px_#2C2C2C] text-center max-w-sm mx-auto space-y-4">
        <div className="w-16 h-16 bg-[#E7F3F1] border-2 border-[#2C2C2C] text-[#2A5C55] rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2C2C2C]">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#2C2C2C] font-sans">오답노트가 완전히 비어있습니다!</h2>
        <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
          대단해요! 아직 틀린 한자가 없거나, 오답노트에 있는 모든 한자 학습 및 마스터를 완료했습니다. 객관식 퀴즈에서 오답이 발생하면 이곳에 차곡차곡 정리됩니다.
        </p>
      </div>
    );
  }

  const activeHanja = incorrectHanjas.find((h) => h.id === selectedHanjaId) || incorrectHanjas[0];

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="bg-[#FDFCF8] border-2 border-[#2C2C2C] rounded-2xl p-6 shadow-[3px_3px_0px_#2C2C2C] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-black text-[#2C2C2C] flex items-center gap-2">
            <Star className="w-5 h-5 text-[#D44D44] fill-[#D44D44]/20" />
            집중 보충 오답노트
          </h2>
          <p className="text-xs text-[#2C2C2C]/75 mt-1 font-sans leading-relaxed">
            한자 퀴즈에서 실수로 클릭했거나 암기가 소홀했던 글자들이 임시로 머무는 장소입니다. 완벽하게 암기 후 제외 버튼을 눌러 소거해 주세요.
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('오답 목록에 있는 한자들을 전부 비우시겠습니까?')) {
              onClearAllIncorrect();
            }
          }}
          className="text-xs font-black text-[#D44D44] hover:text-white bg-white hover:bg-[#D44D44] border-2 border-[#2C2C2C] px-3.5 py-2.5 rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_#2C2C2C] active:translate-y-0.5 active:shadow-none"
        >
          오답노트 전체 비우기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: list of incorrect items */}
        <div className="md:col-span-1 bg-white rounded-2xl border-2 border-[#2C2C2C] p-4 space-y-3 shadow-[3px_3px_0px_#2C2C2C] h-[400px] overflow-y-auto pr-1">
          <span className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-wider px-1 inline-block font-mono">
            틀린 문항 ({incorrectHanjas.length}개)
          </span>

          <div className="space-y-2 font-sans">
            {incorrectHanjas.map((h) => {
              const isActive = h.id === activeHanja.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHanjaId(h.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center justify-between group ${
                    isActive
                      ? 'border-[#2C2C2C] bg-[#E7F3F1] text-[#2A5C55] font-black shadow-[2px_2px_0px_#2C2C2C]'
                      : 'border-[#2C2C2C]/10 bg-[#F2F1ED]/40 text-[#2C2C2C] hover:bg-[#F2F1ED]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded bg-white border-2 border-[#2C2C2C] flex items-center justify-center text-sm font-serif font-black ${isActive ? 'bg-[#2A5C55] text-white' : 'text-slate-800'}`}>
                      {h.character}
                    </span>
                    <div>
                      <div className="text-xs font-black leading-tight">{h.meaningReading}</div>
                      <span className="text-[9px] opacity-60 font-medium">{h.level}</span>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-[#2C2C2C]/30 group-hover:text-[#D44D44] transition-colors ${isActive ? 'translate-x-[1.5px]' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: active Hanja detail view & master confirmation */}
        <div className="md:col-span-2 bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 shadow-[4px_4px_0px_#2C2C2C] flex flex-col justify-between min-h-[400px]">
          {activeHanja && (
            <>
              {/* Top part: detail stats */}
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b-2 border-[#2C2C2C]/10 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#F9ECEB] text-[#D44D44] border-2 border-[#2C2C2C] rounded-2xl flex items-center justify-center text-4xl font-serif font-black select-none shadow-[2px_2px_0px_#2C2C2C]">
                      {activeHanja.character}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#2C2C2C]">{activeHanja.meaningReading}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-1.5 text-[10px] text-slate-500 font-sans">
                        <span className="bg-[#F2F1ED] border border-[#2C2C2C]/20 px-2.5 py-0.5 rounded text-[#2C2C2C] font-semibold">부수: {activeHanja.radical} ({activeHanja.radicalName})</span>
                        <span className="bg-[#F2F1ED] border border-[#2C2C2C]/20 px-2.5 py-0.5 rounded text-[#2C2C2C] font-semibold">총 {activeHanja.strokeCount}획</span>
                        <span className="bg-[#F2F1ED] border border-[#2C2C2C]/20 px-2.5 py-0.5 rounded text-[#2C2C2C] font-semibold">{activeHanja.level}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  {/* Explanations mnemonic */}
                  {activeHanja.tip && (
                    <div className="bg-[#FDFCF8] border-2 border-[#2C2C2C] rounded-xl p-4 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.04)]">
                      <span className="font-black text-[#D44D44] block mb-1">💡 연상 기법</span>
                      <p className="text-[#2C2C2C]/80 leading-relaxed font-sans font-medium">{activeHanja.tip}</p>
                    </div>
                  )}

                  {/* Useful practical words */}
                  {activeHanja.exampleWords && activeHanja.exampleWords.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-[#2C2C2C]/55 block uppercase tracking-wider">📝 실용 어휘 분석</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeHanja.exampleWords.map((word, wIdx) => (
                          <div key={wIdx} className="bg-[#F2F1ED] border border-[#2C2C2C]/30 rounded-xl p-3">
                            <div className="font-extrabold text-[#2A5C55] font-sans">{word.word} ({word.reading})</div>
                            <div className="text-[#2C2C2C]/70 mt-1 text-[11px] leading-relaxed font-sans font-semibold">{word.definition}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom part: master clear action */}
              <div className="border-t-2 border-[#2C2C2C]/10 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[10px] font-bold text-[#2C2C2C]/40 font-sans max-w-[320px] text-center sm:text-left leading-relaxed">
                  충분한 자필 작성을 마치고 암기에 자신감이 생겼다면 보관 완료 버튼을 눌러 지워주세요.
                </span>
                <button
                  onClick={() => onRemoveFromIncorrect(activeHanja.id)}
                  className="w-full sm:w-auto px-5 py-3 bg-[#2A5C55] hover:bg-[#1e4641] text-white border-2 border-[#2C2C2C] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_#2C2C2C] transition-all"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  완벽 암기 완료! 오답에서 제외
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
