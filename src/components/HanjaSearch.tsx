import React, { useState } from 'react';
import { Search, Plus, Sparkles, Check, Info, Loader2, AlertCircle } from 'lucide-react';
import { HanjaType } from '../types';

interface HanjaSearchProps {
  onAddHanja: (hanja: Omit<HanjaType, 'id' | 'createdAt'>) => void;
  savedHanja: HanjaType[];
}

const SEARCH_TIPS = [
  "단일 한자 검색 가능 (예: 明, 韓)",
  "뜻이나 음으로 검색 가능 (예: 밝을 명, 배울 학, 명)",
  "두 글자 이상 단어로 검색 가능 (예: 학교, 공부, 자연)"
];

const LOADING_MESSAGES = [
  "한자의 자원을 탐색하는 중입니다...",
  "AI가 훈음과 부수 정보를 정리하고 있습니다...",
  "급수 정보와 실생활 단어 예시를 찾는 중입니다...",
  "쉽게 암기할 수 있는 꿀팁을 구성하고 있습니다...",
  "잠시만 기다려 주시면 완벽한 카드가 완성됩니다!"
];

export default function HanjaSearch({ onAddHanja, savedHanja }: HanjaSearchProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [results, setResults] = useState<Omit<HanjaType, 'id' | 'createdAt'>[]>([]);
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
      const response = await fetch('/api/search-hanja', {
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
        setError('검색 결과에 맞는 한자가 없습니다. 다른 한자나 훈음을 입력해보세요.');
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadySaved = (char: string) => {
    return savedHanja.some((h) => h.character === char);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Bar Section */}
      <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-6 shadow-[4px_4px_0px_#2C2C2C]">
        <h2 className="text-xl font-black text-[#2C2C2C] mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D44D44] fill-[#D44D44]/20" />
          AI 한자 사전 검색
        </h2>
        <p className="text-xs text-[#2C2C2C]/60 mb-6 font-sans">
          원하는 한자나 한글 설명, 단어를 입력하면 AI가 부수, 획수, 예문 및 연상 암기팁까지 한눈에 분석해 드립니다.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="예: '明', '밝을 명', '학교' 등을 검색해 보세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-14 py-3.5 bg-[#FDFCF8] border-2 border-[#2C2C2C] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D44D44]/10 text-xs placeholder:text-[#2C2C2C]/40 font-sans transition-all shadow-[2px_2px_0px_#2C2C2C]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#D44D44] hover:bg-[#c23e35] disabled:bg-slate-300 text-white border-2 border-[#2C2C2C] transition-all cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.15)] disabled:shadow-none"
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
            간편 검색 요령
          </h3>
          <ul className="text-xs text-[#2C2C2C]/80 space-y-1 font-sans">
            {SEARCH_TIPS.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] font-medium">
                <span className="text-[#D44D44] mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Loading Overlay or State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-[#2C2C2C] shadow-[4px_4px_0px_#2C2C2C] min-h-[300px]">
          <Loader2 className="w-10 h-10 text-[#D44D44] animate-spin mb-4" />
          <p className="font-black text-[#2C2C2C] animate-pulse text-center text-sm">
            {LOADING_MESSAGES[loadingMsgIdx]}
          </p>
          <p className="text-xs text-[#2C2C2C]/50 mt-1.5 font-sans font-medium">지능형 한자 사전 구축 중...</p>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="bg-[#F9ECEB] border-2 border-[#D44D44]/30 rounded-2xl p-6 text-center max-w-lg mx-auto shadow-[4px_4px_0px_#2C2C2C]">
          <AlertCircle className="w-8 h-8 text-[#D44D44] mx-auto mb-2" />
          <p className="text-sm font-black text-[#D44D44] mb-1">알림</p>
          <p className="text-xs text-[#D44D44]/90 font-sans leading-relaxed">{error}</p>
        </div>
      )}

      {/* Results Listing */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-[#2C2C2C]/60 px-1 uppercase tracking-wider font-mono">
            SEARCH RESULTS ({results.length} KEYS FOUND)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((item, idx) => {
              const saved = isAlreadySaved(item.character);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border-2 border-[#2C2C2C] overflow-hidden shadow-[4px_4px_0px_#2C2C2C] hover:shadow-[6px_6px_0px_#2C2C2C] transition-shadow flex flex-col"
                >
                  <div className="p-5 flex-1">
                    {/* Character and basic info */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#FDFCF8] border-2 border-[#2C2C2C] rounded-2xl flex items-center justify-center text-4xl font-serif font-black text-[#2C2C2C] shadow-[2px_2px_0px_#2C2C2C]">
                          {item.character}
                        </div>
                        <div>
                          <div className="text-base font-black text-[#2C2C2C] tracking-tight">{item.meaningReading}</div>
                          <div className="flex flex-wrap gap-1.5 mt-1.5 text-[10px] text-slate-500">
                            <span className="bg-[#F2F1ED] border border-[#2C2C2C]/20 text-[#2C2C2C]/80 px-2 py-0.5 rounded font-sans">
                              부수: {item.radical} ({item.radicalName})
                            </span>
                            <span className="bg-[#F2F1ED] border border-[#2C2C2C]/20 text-[#2C2C2C]/80 px-2 py-0.5 rounded font-sans">
                              획수: {item.strokeCount}획
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#E7F3F1] text-[#2A5C55] font-black tracking-wide border border-[#2C2C2C]/30 px-2.5 py-1 rounded">
                        {item.level || '급수 외부'}
                      </span>
                    </div>

                    {/* Mnemonic tip */}
                    {item.tip && (
                      <div className="bg-[#D44D44]/5 border border-[#D44D44]/20 rounded-xl p-3 mb-4 text-xs">
                        <span className="font-black text-[#D44D44] flex items-center gap-1 mb-1">
                          💡 연상 암기 비법
                        </span>
                        <p className="text-[#2C2C2C]/80 leading-relaxed font-sans text-[11px]">{item.tip}</p>
                      </div>
                    )}

                    {/* Example Words */}
                    {item.exampleWords && item.exampleWords.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-[#2C2C2C]/50 uppercase tracking-widest block">
                          📝 실생활 활용 한자어
                        </span>
                        <div className="space-y-1.5 font-sans">
                          {item.exampleWords.map((wordObj, wIdx) => (
                            <div
                              key={wIdx}
                              className="text-xs bg-[#FDFCF8] border-2 border-[#2C2C2C] p-2.5 rounded-xl hover:bg-[#F2F1ED]/50 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.06)]"
                            >
                              <div className="flex items-center justify-between text-[#2C2C2C] mb-0.5">
                                <span className="font-bold tracking-wide">{wordObj.word} ({wordObj.reading})</span>
                              </div>
                              <span className="text-[#2C2C2C]/70 leading-relaxed text-[11px]">
                                {wordObj.definition}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add action */}
                  <div className="bg-[#F2F1ED] border-t-2 border-[#2C2C2C] p-4 flex items-center justify-between">
                    <span className="text-[11px] text-[#2C2C2C]/50 font-sans tracking-wide">
                      {saved ? '이미 보관함에 들어있는 한자입니다' : '보관함에 보태어 학습해 보세요'}
                    </span>
                    <button
                      disabled={saved}
                      onClick={() => onAddHanja(item)}
                      className={`px-4.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border-2 ${
                        saved
                          ? 'border-[#2C2C2C]/30 bg-transparent text-[#2C2C2C]/40 cursor-default shadow-none'
                          : 'border-[#2C2C2C] bg-[#2C2C2C] hover:bg-black text-[#FDFCF8] active:scale-95 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.15)] hover:shadow-none'
                      }`}
                    >
                      {saved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2C2C2C]/40" />
                          저장 완료
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-white" />
                          보관함 추가
                        </>
                      )}
                    </button>
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
