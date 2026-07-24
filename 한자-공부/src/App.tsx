import React, { useState, useEffect } from 'react';
import { BookOpen, Search, HelpCircle, Award, Star, BookMarked, Sparkles, Plus, Trash2, LayoutGrid, Check, CheckCircle2, BookOpen as BookIcon } from 'lucide-react';
import { HanjaType, IdiomType } from './types';
import HanjaSearch from './components/HanjaSearch';
import HanjaFlashcard from './components/HanjaFlashcard';
import SelfTest from './components/SelfTest';
import QuizTest from './components/QuizTest';
import IncorrectNote from './components/IncorrectNote';
import IdiomSearch from './components/IdiomSearch';
import IdiomFlashcard from './components/IdiomFlashcard';
import IdiomSelfTest from './components/IdiomSelfTest';
import IdiomQuizTest from './components/IdiomQuizTest';
import HyeongSeolIcon from './components/HyeongSeolIcon';

// Pre-seeded high quality Hanja to provide an outstanding immediate initial user experience
const INITIAL_HANJA_SEED: HanjaType[] = [
  {
    id: 'seed-1',
    character: '明',
    meaning: '밝을',
    reading: '명',
    meaningReading: '밝을 명',
    radical: '日',
    radicalName: '날 일',
    strokeCount: 8,
    level: '8급',
    tip: '해(日)와 달(月)의 빛이 합쳐져 세상이 온통 환하고 밝다는 뜻입니다.',
    exampleWords: [
      { word: '文明', reading: '문명', definition: '인류가 물질적, 사회적으로 쌓아 올린 찬란한 생활양식과 상태.' },
      { word: '明白', reading: '명백', definition: '의심할 여지 없이 아주 또렷하고 분명함.' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-2',
    character: '學',
    meaning: '배울',
    reading: '학',
    meaningReading: '배울 학',
    radical: '子',
    radicalName: '아들 자',
    strokeCount: 16,
    level: '8급',
    tip: '아이들(子)이 지붕 밑 양손에 책을 받쳐 들고 하나씩 깨우치며 배움을 익히는 모습입니다.',
    exampleWords: [
      { word: '學校', reading: '학교', definition: '학생들이 모여 배움을 얻고 교사에게 지도를 받는 공식 교육기관.' },
      { word: '學生', reading: '학생', definition: '학교나 교육기관에 등록되어 배움에 전념하는 지적 사회 구성원.' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-3',
    character: '韓',
    meaning: '나라',
    reading: '한',
    meaningReading: '나라 한',
    radical: '韋',
    radicalName: '가죽 위',
    strokeCount: 17,
    level: '준4급',
    tip: '아침 햇살 아래 우물가의 가죽 테두리 성곽을 둘러싼 평화롭고 큰 나라(삼한, 한국)를 지칭합니다.',
    exampleWords: [
      { word: '韓國', reading: '한국', definition: '아름다운 금수강산과 유구한 한민족 역사를 지닌 우리 나라.' },
      { word: '韓流', reading: '한류', definition: '한국의 음악, 드라마 등 독자적인 문화 요소가 해외에서 선풍적인 인기를 끄는 현상.' }
    ],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_IDIOM_SEED: IdiomType[] = [
  {
    id: 'seed-idiom-1',
    idiom: '悠悠自適',
    reading: '유유자적',
    meaning: '속세를 완전히 떠나 아무것에도 얽매이지 않고, 자기가 하고 싶은 대로 일가견 여유롭고 편안하게 살아감.',
    literalMeaning: '悠(멀 유) 悠(멀 유) 自(스스로 자) 適(갈/편안할 적) - 한가로이 흐르고 스스로 만족해 편안함을 찾아감',
    tip: '유유히 유영하는 배 위에서 스스로(自) 삶의 편안함(適)과 한적함을 만끽하는 여유로운 은둔 선비를 형상화해 보세요.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-idiom-2',
    idiom: '以心傳心',
    reading: '이심전심',
    meaning: '말이나 거추장스러운 문자를 일부러 늘어놓지 않고도 마음에서 곧바로 마음으로 뜻이 온전히 전해지고 통함.',
    literalMeaning: '以(할/말을 써 이) 心(마음 심) 傳(전해줄 전) 心(마음 심) - 내 가슴의 마음을 매개로 삼아 서로의 마음으로 전함',
    tip: '소리 내지 않고 오직 따뜻한 눈빛(心)을 써서(以) 고스란히 상대의 가슴(心)에 내 진심을 전하는(傳) 조화로운 마음속 대화를 그려보세요.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'seed-idiom-3',
    idiom: '切齒腐心',
    reading: '절치부심',
    meaning: '몹시 분하고 통탄스러워 이를 부득부득 갈고 가슴속 간장을 태우며 다짐을 굳게 벼름.',
    literalMeaning: '切(끊을/갈 절) 齒(이 치) 腐(썩을 부) 心(마음 심) - 아프게 이를 갈고 마음을 하얗게 썩힘',
    tip: '너무나 분하고 아쉬워 이(齒)를 부득이하게 부러뜨리듯 갈아대고(切), 심장(心)이 문드러지듯(腐) 태우며 내일의 결전을 다시 맹세해보세요.',
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [studyMode, setStudyMode] = useState<'hanja' | 'idiom'>('hanja');
  const [activeTab, setActiveTab] = useState<'notebook' | 'search' | 'selftest' | 'quiz' | 'incorrect'>('notebook');
  const [savedHanja, setSavedHanja] = useState<HanjaType[]>([]);
  const [savedIdioms, setSavedIdioms] = useState<IdiomType[]>([]);
  const [incorrectHanjaIds, setIncorrectHanjaIds] = useState<string[]>([]);
  const [noteSearch, setNoteSearch] = useState('');
  const [idiomSearch, setIdiomSearch] = useState('');
  const [justAddedNotify, setJustAddedNotify] = useState<string | null>(null);
  const [justAddedIdiomNotify, setJustAddedIdiomNotify] = useState<string | null>(null);

  // Initialize and load persistent user data from localStorage
  useEffect(() => {
    const localHanja = localStorage.getItem('hanja_notebook_saved');
    const localIncorrect = localStorage.getItem('hanja_notebook_incorrect');
    const localIdioms = localStorage.getItem('idiom_notebook_saved');

    if (localHanja) {
      try {
        setSavedHanja(JSON.parse(localHanja));
      } catch (e) {
        setSavedHanja(INITIAL_HANJA_SEED);
      }
    } else {
      setSavedHanja(INITIAL_HANJA_SEED);
      localStorage.setItem('hanja_notebook_saved', JSON.stringify(INITIAL_HANJA_SEED));
    }

    if (localIncorrect) {
      try {
        setIncorrectHanjaIds(JSON.parse(localIncorrect));
      } catch (e) {
        setIncorrectHanjaIds([]);
      }
    }

    if (localIdioms) {
      try {
        setSavedIdioms(JSON.parse(localIdioms));
      } catch (e) {
        setSavedIdioms(INITIAL_IDIOM_SEED);
      }
    } else {
      setSavedIdioms(INITIAL_IDIOM_SEED);
      localStorage.setItem('idiom_notebook_saved', JSON.stringify(INITIAL_IDIOM_SEED));
    }
  }, []);

  // Sync idiom list
  const saveIdiomList = (list: IdiomType[]) => {
    setSavedIdioms(list);
    localStorage.setItem('idiom_notebook_saved', JSON.stringify(list));
  };

  // Sync saved list
  const saveHanjaList = (list: HanjaType[]) => {
    setSavedHanja(list);
    localStorage.setItem('hanja_notebook_saved', JSON.stringify(list));
  };

  // Sync incorrect list
  const saveIncorrectIds = (ids: string[]) => {
    setIncorrectHanjaIds(ids);
    localStorage.setItem('hanja_notebook_incorrect', JSON.stringify(ids));
  };

  // 1. Add Hanja
  const handleAddHanja = (newHanja: Omit<HanjaType, 'id' | 'createdAt'>) => {
    const id = `hanja-${Date.now()}`;
    const itemToAdd: HanjaType = {
      ...newHanja,
      id,
      createdAt: new Date().toISOString()
    };
    const updated = [itemToAdd, ...savedHanja];
    saveHanjaList(updated);

    // Notify pop
    setJustAddedNotify(newHanja.character);
    setTimeout(() => {
      setJustAddedNotify(null);
    }, 2500);
  };

  // 2. Delete Hanja globally
  const handleDeleteHanja = (id: string) => {
    const updated = savedHanja.filter((h) => h.id !== id);
    saveHanjaList(updated);

    // Also remove from incorrect notes list if deleted
    const updatedIncorrect = incorrectHanjaIds.filter((wrongId) => wrongId !== id);
    saveIncorrectIds(updatedIncorrect);
  };

  // 3. Register wrong answers
  const handleWrongAnswer = (hanja: HanjaType) => {
    if (!incorrectHanjaIds.includes(hanja.id)) {
      const updated = [...incorrectHanjaIds, hanja.id];
      saveIncorrectIds(updated);
    }
  };

  // 4. Remove single item from incorrect List (Mastered)
  const handleRemoveFromIncorrect = (id: string) => {
    const updated = incorrectHanjaIds.filter((wrongId) => wrongId !== id);
    saveIncorrectIds(updated);
  };

  // 5. Clear all incorrect entries
  const handleClearAllIncorrect = () => {
    saveIncorrectIds([]);
  };

  // Search filter on my notebook tab
  const filteredNotebook = savedHanja.filter((h) => {
    const txt = noteSearch.toLowerCase();
    return (
      h.character.includes(txt) ||
      h.meaningReading.toLowerCase().includes(txt) ||
      (h.level && h.level.toLowerCase().includes(txt)) ||
      (h.radicalName && h.radicalName.toLowerCase().includes(txt))
    );
  });

  // Handler for adding idioms
  const handleAddIdiom = (newIdiom: Omit<IdiomType, 'id' | 'createdAt'>) => {
    const id = `idiom-${Date.now()}`;
    const itemToAdd: IdiomType = {
      ...newIdiom,
      id,
      createdAt: new Date().toISOString()
    };
    const updated = [itemToAdd, ...savedIdioms];
    saveIdiomList(updated);

    // Notify pop up
    setJustAddedIdiomNotify(newIdiom.reading);
    setTimeout(() => {
      setJustAddedIdiomNotify(null);
    }, 2500);
  };

  // Handler for deleting idioms
  const handleDeleteIdiom = (id: string) => {
    const updated = savedIdioms.filter((i) => i.id !== id);
    saveIdiomList(updated);
  };

  // Filter saved idioms
  const filteredIdioms = savedIdioms.filter((i) => {
    const txt = idiomSearch.toLowerCase();
    return (
      i.idiom.includes(txt) ||
      i.reading.toLowerCase().includes(txt) ||
      i.meaning.toLowerCase().includes(txt) ||
      i.literalMeaning.toLowerCase().includes(txt)
    );
  });

  // Safe mode modifier
  const handleSetStudyMode = (mode: 'hanja' | 'idiom') => {
    setStudyMode(mode);
    if (mode === 'idiom' && activeTab === 'incorrect') {
      setActiveTab('notebook');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C2C2C] pb-20 font-sans selection:bg-[#D44D44]/10 selection:text-[#2C2C2C]">
      
      {/* Header Panel as a Bento Grid element */}
      <header className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
        <div className="bg-[#F2F1ED] border-2 border-[#2C2C2C] rounded-2xl p-4 md:p-6 shadow-[4px_4px_0px_#2C2C2C] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HyeongSeolIcon className="w-12 h-12" />
            <div className="text-left">
              <h1 className="text-2xl font-black text-[#2C2C2C] tracking-tight">
                형설지공 <span className="text-xs font-medium opacity-50 font-mono">v2.5</span>
              </h1>
              <span className="text-[11px] text-[#2C2C2C]/60 font-sans block mt-0.5">반딧불과 쌓인 눈빛으로 학습하는 지혜로운 AI 한자&사자성어 서당</span>
            </div>
          </div>

          {/* Quick stats board with bento color accents */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end font-sans">
            <div className="bg-[#E7F3F1] border-2 border-[#2C2C2C] rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_#2C2C2C] text-[#2A5C55] font-black text-xs">
              <LayoutGrid className="w-4 h-4" />
              <span>보관 한자 <strong className="text-md ml-0.5">{savedHanja.length}</strong>자</span>
            </div>
            
            <div className="bg-[#EBF3FC] border-2 border-[#2C2C2C] rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_#2C2C2C] text-[#2F659C] font-black text-xs">
              <BookIcon className="w-4 h-4" />
              <span>보관 사자성어 <strong className="text-md ml-0.5">{savedIdioms.length}</strong>개</span>
            </div>

            <div className="bg-[#F9ECEB] border-2 border-[#2C2C2C] rounded-xl px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_#2C2C2C] text-[#D44D44] font-black text-xs">
              <Star className="w-4 h-4 fill-[#D44D44]/10" />
              <span>한자 오답노트 <strong className="text-md ml-0.5">{incorrectHanjaIds.length}</strong>자</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mode Switcher Bento Panel */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSetStudyMode('hanja')}
            className={`py-4 px-4 rounded-xl border-2 border-[#2C2C2C] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              studyMode === 'hanja'
                ? 'bg-[#2C2C2C] text-white shadow-[4px_4px_0px_#2A5C55]'
                : 'bg-white text-[#2C2C2C] hover:bg-[#F2F1ED] shadow-[2px_2px_0px_#2C2C2C]'
            }`}
          >
            <span className="text-sm font-serif">漢</span> 한자 공부방
          </button>
          
          <button
            onClick={() => handleSetStudyMode('idiom')}
            className={`py-4 px-4 rounded-xl border-2 border-[#2C2C2C] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              studyMode === 'idiom'
                ? 'bg-[#2C2C2C] text-white shadow-[4px_4px_0px_#D44D44]'
                : 'bg-white text-[#2C2C2C] hover:bg-[#F2F1ED] shadow-[2px_2px_0px_#2C2C2C]'
            }`}
          >
            <span className="text-sm font-serif">書</span> 사자성어 공부방
          </button>
        </div>
      </section>

      {/* Floating alert on successful adds */}
      {justAddedNotify && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C2C2C] text-white text-xs font-bold px-5 py-4 rounded-xl flex items-center gap-2.5 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] border-2 border-white animate-bounce font-sans">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>한자 <strong className="text-emerald-300 font-serif text-lg">'{justAddedNotify}'</strong>이 내 단어장에 안전하게 추가되었습니다!</span>
        </div>
      )}

      {justAddedIdiomNotify && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C2C2C] text-white text-xs font-bold px-5 py-4 rounded-xl flex items-center gap-2.5 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] border-2 border-white animate-bounce font-sans">
          <CheckCircle2 className="w-5 h-5 text-sky-400" />
          <span>사자성어 <strong className="text-sky-300 font-serif text-lg">'{justAddedIdiomNotify}'</strong>이 내 성어 수첩에 안전하게 등재되었습니다!</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-8">
        
        {/* Navigation Tabs with Bento outlines */}
        <div className="flex flex-wrap items-center bg-[#F2F1ED] p-1.5 rounded-2xl border-2 border-[#2C2C2C] shadow-[4px_4px_0px_#2C2C2C] max-w-3xl mx-auto mb-8 font-sans">
          
          <button
            onClick={() => setActiveTab('notebook')}
            className={`flex-1 min-w-[110px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'notebook'
                ? 'bg-[#2C2C2C] text-[#FDFCF8] border-2 border-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.15)] font-black'
                : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C] hover:bg-white/40 border-2 border-transparent'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            {studyMode === 'hanja' ? '내 한자 수첩' : '내 성어 수첩'}
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 min-w-[110px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#2C2C2C] text-[#FDFCF8] border-2 border-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.15)] font-black'
                : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C] hover:bg-white/40 border-2 border-transparent'
            }`}
          >
            <Search className="w-4 h-4" />
            {studyMode === 'hanja' ? '새 한자 검색' : '사자성어 AI 검색'}
          </button>

          <button
            onClick={() => setActiveTab('selftest')}
            className={`flex-1 min-w-[110px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'selftest'
                ? 'bg-[#2C2C2C] text-[#FDFCF8] border-2 border-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.15)] font-black'
                : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C] hover:bg-white/40 border-2 border-transparent'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            셀프 테스트
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 min-w-[110px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-[#2C2C2C] text-[#FDFCF8] border-2 border-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.15)] font-black'
                : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C] hover:bg-white/40 border-2 border-transparent'
            }`}
          >
            <Award className="w-4 h-4" />
            객관식 맞추기
          </button>

          {studyMode === 'hanja' && (
            <button
              onClick={() => setActiveTab('incorrect')}
              className={`flex-1 min-w-[110px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                activeTab === 'incorrect'
                  ? 'bg-[#2C2C2C] text-[#FDFCF8] border-2 border-[#2C2C2C] shadow-[2px_2px_0px_rgba(0,0,0,0.15)] font-black'
                  : 'text-[#2C2C2C]/70 hover:text-[#2C2C2C] hover:bg-white/40 border-2 border-transparent'
              }`}
            >
              <Star className="w-4 h-4" />
              오답노트
              {incorrectHanjaIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D44D44] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#2C2C2C] shadow-sm font-sans animate-pulse">
                  {incorrectHanjaIds.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="font-sans">
          
          {/* STUDY MODE: HANJA WORKSPACE */}
          {studyMode === 'hanja' && (
            <>
              {/* 1. Notebook / My Hanja View */}
              {activeTab === 'notebook' && (
                <div className="space-y-6">
                  {/* Toolbar */}
                  <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-5 shadow-[4px_4px_0px_#2C2C2C] flex flex-col sm:flex-row gap-4 items-center justify-between font-sans">
                    <div className="text-left w-full sm:w-auto">
                      <h2 className="text-lg font-black text-[#2C2C2C]">나만의 한자 보관함</h2>
                      <p className="text-xs text-[#2C2C2C]/60 font-sans mt-0.5">내가 직접 추가한 한자들이 카드 형태로 정리되어 있습니다. 카드를 클릭하면 뜻풀이, 암기 꿀팁, 단어 해설이 열립니다.</p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="한자, 훈음, 부수, 급수 검색..."
                        value={noteSearch}
                        onChange={(e) => setNoteSearch(e.target.value)}
                        className="w-full bg-[#FDFCF8] border-2 border-[#2C2C2C] focus:outline-none focus:ring-4 focus:ring-[#D44D44]/10 rounded-xl pl-4 pr-10 py-2.5 text-xs transition-all font-sans"
                      />
                      <Search className="w-4.5 h-4.5 text-[#2C2C2C] absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Grid block */}
                  {filteredNotebook.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNotebook.map((hanja) => (
                        <HanjaFlashcard
                          key={hanja.id}
                          hanja={hanja}
                          onDelete={handleDeleteHanja}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-12 text-center max-w-md mx-auto space-y-4 shadow-[4px_4px_0px_#2C2C2C]">
                      <div className="w-16 h-16 bg-[#F2F1ED] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2C2C2C]">
                        <BookMarked className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-black text-[#2C2C2C]">일치하는 한자가 없습니다</h3>
                      <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
                        {savedHanja.length === 0
                          ? "보관함에 저장한 한자가 하나도 없습니다! 상단의 '새 한자 검색' 단추를 눌러 스마트 인공지능 분석을 통해 첫 한자 카드를 추가해 보세요."
                          : "검색 결과에 부합하는 카드가 없습니다. 다른 검색어로 시도해 보거나 한글 발음을 입력해 보세요."}
                      </p>
                      {savedHanja.length === 0 && (
                        <button
                          onClick={() => setActiveTab('search')}
                          className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#D44D44] border-2 border-[#2C2C2C] text-white hover:bg-[#c23e35] font-black text-xs rounded-xl shadow-[3px_3px_0px_#2C2C2C] transition-all cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" /> 한자 추가하러 가기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Hanja search tab component */}
              {activeTab === 'search' && (
                <HanjaSearch onAddHanja={handleAddHanja} savedHanja={savedHanja} />
              )}

              {/* 3. Self Test Tab */}
              {activeTab === 'selftest' && (
                <SelfTest savedHanja={savedHanja} />
              )}

              {/* 4. Quiz Test Tab */}
              {activeTab === 'quiz' && (
                <QuizTest savedHanja={savedHanja} onWrongAnswer={handleWrongAnswer} />
              )}

              {/* 5. Incorrect Note Tab */}
              {activeTab === 'incorrect' && (
                <IncorrectNote
                  incorrectHanjaIds={incorrectHanjaIds}
                  savedHanja={savedHanja}
                  onRemoveFromIncorrect={handleRemoveFromIncorrect}
                  onClearAllIncorrect={handleClearAllIncorrect}
                />
              )}
            </>
          )}

          {/* STUDY MODE: IDIOM WORKSPACE */}
          {studyMode === 'idiom' && (
            <>
              {/* 1. Notebook / My Idiom View */}
              {activeTab === 'notebook' && (
                <div className="space-y-6">
                  {/* Toolbar */}
                  <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-5 shadow-[4px_4px_0px_#2C2C2C] flex flex-col sm:flex-row gap-4 items-center justify-between font-sans">
                    <div className="text-left w-full sm:w-auto">
                      <h2 className="text-lg font-black text-[#2C2C2C]">나만의 사자성어 수첩</h2>
                      <p className="text-xs text-[#2C2C2C]/60 font-sans mt-0.5">내가 직접 저장한 사자성어 카드를 모아 볼 수 있습니다. 각 카드를 터치/클릭하여 낱말 개별 쪼개기 정보와 성어 연상 팁을 열람해 보세요.</p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="사자성어, 한글음, 상세 뜻말 검색..."
                        value={idiomSearch}
                        onChange={(e) => setIdiomSearch(e.target.value)}
                        className="w-full bg-[#FDFCF8] border-2 border-[#2C2C2C] focus:outline-none focus:ring-4 focus:ring-[#2A5C55]/10 rounded-xl pl-4 pr-10 py-2.5 text-xs transition-all font-sans"
                      />
                      <Search className="w-4.5 h-4.5 text-[#2C2C2C] absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Grid block */}
                  {filteredIdioms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                      {filteredIdioms.map((idiom) => (
                        <IdiomFlashcard
                          key={idiom.id}
                          idiom={idiom}
                          onDelete={handleDeleteIdiom}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border-2 border-[#2C2C2C] p-12 text-center max-w-md mx-auto space-y-4 shadow-[4px_4px_0px_#2C2C2C]">
                      <div className="w-16 h-16 bg-[#F2F1ED] border-2 border-[#2C2C2C] text-[#2C2C2C] rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#2C2C2C]">
                        <BookMarked className="w-8 h-8 text-[#2F659C]" />
                      </div>
                      <h3 className="text-lg font-black text-[#2C2C2C]">일치하는 사자성어가 없습니다</h3>
                      <p className="text-xs text-[#2C2C2C]/60 font-sans leading-relaxed">
                        {savedIdioms.length === 0
                          ? "사자성어 보관함이 비어 있습니다. 상단의 '사자성어 AI 검색' 탭으로 이동해서 학습할 실용 고사성어들을 검색해 추가해 주세요!"
                          : "검색 요건에 맞는 고사성어가 없습니다. 단어를 변경하여 다시 입력해 주거나 한글 발음으로 찾아 보세요."}
                      </p>
                      {savedIdioms.length === 0 && (
                        <button
                          onClick={() => setActiveTab('search')}
                          className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#2A5C55] border-2 border-[#2C2C2C] text-white hover:bg-[#1e4641] font-black text-xs rounded-xl shadow-[3px_3px_0px_#2C2C2C] transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> 사자성어 추가하러 가기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Idiom search tab component */}
              {activeTab === 'search' && (
                <IdiomSearch onAddIdiom={handleAddIdiom} savedIdioms={savedIdioms} />
              )}

              {/* 3. Idiom Self Test Tab */}
              {activeTab === 'selftest' && (
                <IdiomSelfTest savedIdioms={savedIdioms} />
              )}

              {/* 4. Idiom Quiz Test Tab */}
              {activeTab === 'quiz' && (
                <IdiomQuizTest savedIdioms={savedIdioms} />
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
