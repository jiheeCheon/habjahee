import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { IdiomType } from '../types';

interface IdiomFlashcardProps {
  key?: React.Key;
  idiom: IdiomType;
  onDelete: (id: string) => void;
}

export default function IdiomFlashcard({ idiom, onDelete }: IdiomFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative group h-[360px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      {/* Container holding the flipping animation wrapper */}
      <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* --- FRONT SIDE --- */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 flex flex-col justify-between shadow-[4px_4px_0px_#2C2C2C] hover:shadow-[6px_6px_0px_#2C2C2C] transition-all [backface-visibility:hidden]">
          
          {/* Header */}
          <div className="flex justify-between items-center text-[10px] text-[#2C2C2C]/50 font-mono tracking-wider">
            <span>고사성어 카드</span>
            <span>4-CHAR IDIOM</span>
          </div>

          {/* Character */}
          <div className="flex flex-col items-center justify-center my-4 select-none">
            <div className="text-4xl font-serif font-black text-[#2C2C2C] mb-2 tracking-wide text-center">
              {idiom.idiom}
            </div>
            <div className="text-lg font-black text-[#2A5C55] font-sans">
              “ {idiom.reading} ”
            </div>
            <div className="text-[10px] text-[#2C2C2C]/40 flex items-center gap-1 font-sans mt-3">
              <Eye className="w-3.5 h-3.5 text-[#D44D44]" /> 터치하여 상세 속뜻 개방
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-[#F2F1ED] border-2 border-[#2C2C2C] rounded-xl p-3 text-center text-xs font-black text-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] font-sans">
            이 사자성어의 숨겨진 의미는 무엇일까요?
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
              <span className="text-xl font-serif font-black text-[#D44D44] tracking-wide">{idiom.idiom}</span>
              <span className="text-xs font-black text-white/80 font-sans">({idiom.reading})</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`'${idiom.reading}(${idiom.idiom})' 사자성어를 보관함에서 삭제하시겠습니까?`)) {
                  onDelete(idiom.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-[#D44D44] hover:text-white transition-colors cursor-pointer"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Meaning & Details (scrollable) */}
          <div className="flex-1 my-3 overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-slate-800" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-xs font-black text-[#2A5C55] bg-[#E7F3F1] border border-[#2C2C2C] px-2.5 py-1.5 rounded-lg text-center mb-3 font-sans">
              뜻: {idiom.meaning}
            </h4>

            <div className="space-y-3.5 text-xs font-sans text-[#FDFCF8]/90 leading-relaxed">
              {/* Character analysis break-down */}
              <div>
                <span className="text-[#FDFCF8]/45 text-[10px] font-black uppercase tracking-wider block mb-1">한자별 낱개 해독</span>
                <p className="text-white/85 text-[11px] font-medium bg-[#3E3E3E] rounded-lg p-2 border border-white/5 font-mono">
                  {idiom.literalMeaning}
                </p>
              </div>

              {/* Mnemonic info / story */}
              {idiom.tip && (
                <div className="bg-[#D44D44]/15 border border-[#D44D44]/30 rounded-xl p-2.5">
                  <p className="text-[#D44D44] font-black mb-0.5 flex items-center gap-1 text-[11px]">
                     📚 고사/연상 암기팁
                  </p>
                  <p className="text-[#FDFCF8]/90 text-[11.5px] leading-relaxed">{idiom.tip}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Flip back trigger */}
          <button
            onClick={() => setIsFlipped(false)}
            className="w-full py-2.5 border-2 border-white/10 hover:border-white/20 bg-[#3E3E3E] rounded-xl text-center text-xs text-[#FDFCF8]/80 hover:text-white transition-all cursor-pointer font-sans font-black"
          >
            뒤집어 원위치로
          </button>
          
        </div>

      </div>
    </div>
  );
}
