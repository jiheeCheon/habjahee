import React, { useState } from 'react';
import { Search, Plus, Sparkles, Check, Info, Loader2, AlertCircle } from 'lucide-react';
import { IdiomType } from '../types';

interface IdiomSearchProps {
  onAddIdiom: (idiom: Omit<IdiomType, 'id' | 'createdAt'>) => void;
  savedIdioms: IdiomType[];
}

const SEARCH_TIPS = [
  "사자성어 한자/한글 모두 검색 가능 (예: '유유자적', '悠悠自適')",
  "상황, 감정, 주제 키워드로 검색 가능 (예: '우정', '친구', '노력', '성공')",
  "뜻이나 의미 설명의 조각 단어로 검색 가능 (예: '마음', '대화', '바람')"
];

const LOADING_MESSAGES = [
  "역사적인 문헌과 고사를 탐색하고 있습니다...",
  "AI가 사자성어의 정확한 음독과 매칭 한자를 정리하고 있습니다...",
  "개별 한자 자풀이와 직역 해설을 준비하는 중입니다...",
  "현대 한국어 뜻풀이와 유래 스토리를 가공하는 중입니다...",
  "잠시만 기다려 주시면 완벽한 사자성어 카드가 완성됩니다!"
];

export default function IdiomSearch({ onAddIdiom, savedIdioms }: IdiomSearchProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [results, setResults] = useState<Omit<IdiomType, 'id' | 'createdAt'>[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Rotate loading messages every 2 seconds
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingMsgIdx(0);
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/search-idiom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '검색 결과를 가져오지 못했습니다.');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError('검색 결과에 맞는 사자성어가 없습니다. 다른 주제 단어나 한글명을 입력해 보세요.');
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadySaved = (rawIdiom: string) => {
    return savedIdioms.some((i) => i.idiom === rawIdiom);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Bar Section */}
      <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 shadow-[4px_4px_0px_#2C2C2C]">
        <h2 className="text-xl font-black text-[#2C2C2C] mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D44D44] fill-[#D44D44]/20" />
          AI 사자성어 사전 검색
        </h2>
        <p className="text-xs text-[#2C2C2C]/60 mb-6 font-sans leading-relaxed">
          원하는 상황(예: '노력', '우정'), 훈음, 한자 혹은 뜻풀이를 입력하면 AI가 사자성어의 속뜻, 글자별 분석, 연상 기억 팁을 명품 카드로 제작하여 실시간 수록해 드립니다.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="예: '유유자적', '마음', '친구와 깊은 정' 등 자유롭게 입력..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-14 py-3.5 bg-[#FDFCF8] border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D44D44]/15 text-xs placeholder:text-[#2C2C2C]/40 font-sans transition-all shadow-[2px_2px_0px_#2C2C2C]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#2A5C55] hover:bg-[#1e4641] disabled:bg-slate-300 text-white border-2 border-[#2C2C2C] transition-all cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.15)] disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Search className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </form>

        {/* Info tips */}
        <div className="mt-5 bg-[#F2F1ED] rounded-xl p-4 border-2 border-[#2C2C2C] shadow-[2px_2px_0px_#2C2C2C]">
          <h3 className="text-xs font-black text-[#2C2C2C] flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-[#D44D44]" />
            성공적인 AI 추천 사자성어 검색법
          </h3>
          <ul className="text-xs text-[#2C2C2C]/70 font-sans list-disc pl-5 space-y-1.5 leading-relaxed">
            {SEARCH_TIPS.map((tip, idx) => (
              <li key={idx} className="font-medium text-[11px]">{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Loading Block */}
      {isLoading && (
        <div className="bg-[#FDFCF8] border-2 border-dashed border-[#2C2C2C] rounded-2xl p-12 text-center space-y-5 animate-pulse shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
          <Loader2 className="w-10 h-10 animate-spin text-[#D44D44] mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#2C2C2C]">명품 인공지능 사자성어 분석 카드 조립 중</h4>
            <p className="text-xs text-[#2C2C2C]/60 font-sans">{LOADING_MESSAGES[loadingMsgIdx]}</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-[#F9ECEB] border-2 border-[#D44D44] rounded-2xl p-5 flex items-start gap-3.5 text-[#D44D44] shadow-[3px_3px_0px_rgba(0,0,0,0.03)] font-sans">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-extrabold text-xs">검색 중 오류 발생</h5>
            <p className="text-[11px] mt-1 text-[#D44D44]/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Search results rendering */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-[#2C2C2C]/50 uppercase tracking-widest px-1 font-mono">
            인공지능 분석 추천 검색 결과 ({results.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((item, idx) => {
              const saved = isAlreadySaved(item.idiom);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border-2 border-[#2C2C2C] shadow-[4px_4px_0px_#2C2C2C] p-6 flex flex-col justify-between space-y-5 hover:translate-y-[-2px] transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b-2 border-[#2C2C2C]/10 pb-3">
                      <div>
                        {/* Chinese character block */}
                        <div className="text-3xl font-serif font-black text-[#2C2C2C] tracking-wide">
                          {item.idiom}
                        </div>
                        <div className="text-sm font-black text-[#2A5C55] mt-1 flex items-center gap-1.5 font-sans">
                          {item.reading}
                        </div>
                      </div>

                      <button
                        onClick={() => !saved && onAddIdiom(item)}
                        disabled={saved}
                        className={`px-3.5 py-2.5 rounded-xl border-2 border-[#2C2C2C] text-[11px] font-black cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 active:shadow-none transition-all ${
                          saved
                            ? 'bg-[#E7F3F1] border-[#2A5C55]/30 text-[#2A5C55] cursor-default'
                            : 'bg-[#D44D44] text-white hover:bg-[#c23e35] shadow-[2px_2px_0px_#2C2C2C]'
                        }`}
                      >
                        {saved ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> 이미 보관함 수록됨
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> 내 사자성어 수첩에 수록
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Character translation */}
                      <p className="text-[11px] font-semibold text-[#2C2C2C]/70">
                        <span className="font-black text-[#2C2C2C]">글자 분석:</span> {item.literalMeaning}
                      </p>

                      {/* Complete meaning context */}
                      <div className="bg-[#FDFCF8] border border-[#2C2C2C]/20 rounded-lg p-3 font-sans shadow-sm">
                        <span className="font-extrabold text-[#2C2C2C]/90 text-[11px] block mb-0.5">속뜻 풀이</span>
                        <p className="text-[#2C2C2C]/80 leading-relaxed font-sans font-medium text-[11px]">{item.meaning}</p>
                      </div>

                      {/* Origin story / memory tip */}
                      {item.tip && (
                        <div className="bg-[#F2F1ED] rounded-xl p-3 border border-[#2C2C2C]/25 text-[11px] leading-relaxed text-[#2C2C2C]/85">
                          <span className="font-black text-[#D44D44] block mb-0.5">💡 연상 기법 & 유래 설명</span>
                          <span className="font-sans font-medium">{item.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
