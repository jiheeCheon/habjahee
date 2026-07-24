import React, { useState } from 'react';
import { Eye, BookOpen, Trash2, HelpCircle, ChevronRight, Bookmark } from 'lucide-react';
import { HanjaType } from '../types';

interface HanjaFlashcardProps {
  key?: React.Key;
  hanja: HanjaType;
  onDelete: (id: string) => void;
}

export default function HanjaFlashcard({ hanja, onDelete }: HanjaFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative group h-[360px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      {/* Container holding the flipping animation wrapper */}
      <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* --- FRONT SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 flex flex-col justify-between shadow-[4px_4px_0px_#2C2C2C] hover:shadow-[6px_6px_0px_#2C2C2C] transition-all [backface-visibility:hidden]">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] bg-[#E7F3F1] text-[#2A5C55] font-black tracking-wide border border-[#2C2C2C]/40 px-2 py-0.5 rounded">
              {hanja.level}
            </span>
            <span className="text-[10px] text-[#2C2C2C]/50 font-mono tracking-wider">
              {hanja.strokeCount}획 | 부수: {hanja.radical}
            </span>
          </div>

          {/* Character */}
          <div className="flex flex-col items-center justify-center my-4 select-none">
            <div className="text-7xl font-serif font-black text-[#2C2C2C] mb-2 filter drop-shadow-sm">
              {hanja.character}
            </div>
            <div className="text-[11px] text-[#2C2C2C]/50 flex items-center gap-1 font-sans">
              <Eye className="w-3.5 h-3.5 text-[#D44D44]" /> 터치하여 뜻 확인
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-[#F2F1ED] border-2 border-[#2C2C2C] rounded-xl p-3 text-center text-xs font-black text-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] font-sans">
            이 한자의 뜻과 음은 무엇일까요?
          </div>
          
        </div>

        {/* --- BACK SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-[#2C2C2C] text-[#FDFCF8] rounded-2xl border-2 border-[#2C2C2C] p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(0,0,0,0.2)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
             onClick={(e) => {
               // Prevent flipping when clicking interactive delete button
               e.stopPropagation();
             }}>
          
          {/* Top meta */}
          <div className="flex justify-between items-center" onClick={() => setIsFlipped(false)}>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-serif font-black text-[#D44D44]">{hanja.character}</span>
              <span className="text-[10px] bg-[#3E3E3E] text-[#FDFCF8]/90 px-2 py-0.5 rounded font-mono border border-white/10">{hanja.level}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`'${hanja.character}' 한자를 삭제하시겠습니까?`)) {
                  onDelete(hanja.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-[#D44D44] hover:text-white transition-colors cursor-pointer"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Meaning & Details (scrollable index back card if too long, else clean flex) */}
          <div className="flex-1 my-3 overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-slate-800" onClick={(e) => e.stopPropagation()}>
            {/* Pronunciation and core meaning */}
            <h4 className="text-lg font-black text-[#FDFCF8] tracking-wide border-b border-white/15 pb-1.5 mb-2 font-sans">
              {hanja.meaningReading}
            </h4>

            <div className="space-y-3 text-xs leading-relaxed font-sans text-[#FDFCF8]/85">
              {/* Mnemonic info */}
              {hanja.tip && (
                <div className="bg-[#D44D44]/10 border border-[#D44D44]/30 rounded-xl p-2.5">
                  <p className="text-[#D44D44] font-black mb-0.5 flex items-center gap-1 text-[11px]">
                     💡 암기 공식
                  </p>
                  <p className="text-[#FDFCF8]/90 text-[11px] leading-relaxed">{hanja.tip}</p>
                </div>
              )}

              {/* Radicals */}
              <div>
                <span className="text-[#FDFCF8]/40 text-[10px] font-bold uppercase tracking-wider block mb-0.5">부수 정보</span>
                <p className="text-[#FDFCF8] font-medium font-mono text-[11px]">
                  {hanja.radical} ({hanja.radicalName}) | 총 {hanja.strokeCount}획
                </p>
              </div>

              {/* Example Korean Words */}
              {hanja.exampleWords && hanja.exampleWords.length > 0 && (
                <div>
                  <span className="text-[#FDFCF8]/40 text-[10px] font-bold uppercase tracking-wider block mb-1">활용 한자어</span>
                  <div className="space-y-1.5">
                    {hanja.exampleWords.map((wordObj, idx) => (
                      <div key={idx} className="bg-[#3A3A3A] border border-white/5 rounded-lg p-2 font-mono">
                        <div className="flex items-center justify-between font-bold text-[#FDFCF8] text-[11px]">
                          <span>{wordObj.word} ({wordObj.reading})</span>
                        </div>
                        <p className="text-[#FDFCF8]/60 text-[10px] mt-0.5 leading-relaxed font-sans">{wordObj.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Flip back trigger */}
          <button
            onClick={() => setIsFlipped(false)}
            className="w-full py-2 border-2 border-white/10 hover:border-white/20 bg-[#3E3E3E] rounded-xl text-center text-xs text-[#FDFCF8]/80 hover:text-white transition-colors cursor-pointer font-sans font-bold"
          >
            뒤집기 원위치
          </button>
          
        </div>

      </div>
    </div>
  );
}
