//@ts-nocheck

import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot, 
  deleteDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

// --- Firebase & API 설정 ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'parenting-v8-2-full-restore';
const apiKey = ""; 

// --- 도메인 상수 ---
const CATEGORIES = [
  { id: 'all', name: '전체', icon: '🌈' },
  { id: 'restaurant', name: '식당', icon: '🍴' },
  { id: 'cafe', name: '카페', icon: '☕' },
  { id: 'activity', name: '놀거리', icon: '🎡' },
];

const CONCEPTS = [
  { id: 'all', name: '전체 컨셉', icon: '✨' },
  { id: 'energy', name: '에너지 발산', icon: '⚡' },
  { id: 'healing', name: '감성 힐링', icon: '🌿' },
  { id: 'culture', name: '문화 체험', icon: '🎨' },
  { id: 'shopping', name: '쇼핑 데이트', icon: '🛍️' },
];

// 고도화: 전체 시설 리스트 (비교 노출용)
const ALL_AMENITIES_LIST = [
  '아기의자', '유모차통로', '수유실', '기저귀대', '전자레인지', '좌식공간', '키즈메뉴'
];

const AMENITY_ICONS = {
  '아기의자': '💺', '유모차통로': '🛒', '수유실': '🍼', '기저귀대': '🚽',
  '전자레인지': '🔌', '좌식공간': '🍵', '키즈메뉴': '🍱', '주차가능': '🅿️', '주차협소': '⚠️',
};

const AGE_GROUPS = [
  { id: 'baby', name: '0-12개월', icon: '👶' },
  { id: 'toddler', name: '13-24개월', icon: '🧸' },
  { id: 'child', name: '24개월+', icon: '🏃' },
];

const ESSENTIAL_ITEMS = [
  { id: 'chair', name: '아기의자', icon: '💺' },
  { id: 'stroller', name: '유모차통로', icon: '🛒' },
  { id: 'nursing', name: '수유실', icon: '🍼' },
  { id: 'table', name: '기저귀대', icon: '🚽' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('explore'); // explore, course, my, admin
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeConcept, setActiveConcept] = useState('all');
  const [selectedAge, setSelectedAge] = useState('baby');
  const [places, setPlaces] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // 상태 관리 (AI, 북마크, 관리자)
  const [aiResult, setAiResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [tickerMsg, setTickerMsg] = useState("지금 '식당A' 주변 코스 탐색이 활발해요!");
  const [showNavOptions, setShowNavOptions] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestData, setSuggestData] = useState({ name: '', address: '', reason: '' });

  // 1. 인증 초기화
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error(err); }
    };
    initAuth();
    onAuthStateChanged(auth, setUser);
  }, []);

  // 2. 실시간 데이터 스트리밍
  useEffect(() => {
    if (!user) return;
    const pCol = collection(db, 'artifacts', appId, 'public', 'data', 'places');
    const cCol = collection(db, 'artifacts', appId, 'public', 'data', 'courses');
    const bCol = collection(db, 'artifacts', appId, 'users', user.uid, 'bookmarks');
    const rCol = collection(db, 'artifacts', appId, 'users', user.uid, 'recentViews');
    const reqCol = collection(db, 'artifacts', appId, 'public', 'data', 'requests');

    const unsubP = onSnapshot(pCol, (s) => setPlaces(s.docs.length ? s.docs.map(d => ({id: d.id, ...d.data()})) : getMockPlaces()));
    const unsubC = onSnapshot(cCol, (s) => setCourses(s.docs.length ? s.docs.map(d => ({id: d.id, ...d.data()})) : getMockCourses()));
    const unsubB = onSnapshot(bCol, (s) => setBookmarks(s.docs.map(d => d.id)));
    const unsubR = onSnapshot(rCol, (s) => setRecentViews(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a,b) => b.viewedAt - a.viewedAt).slice(0, 10)));
    const unsubReq = onSnapshot(reqCol, (s) => setAdminRequests(s.docs.map(d => ({id: d.id, ...d.data()}))));

    // 실시간 티커 로직
    const msgs = [
      "지금 '식당A'에 15명의 부모님이 접속 중!",
      "근처 '카페B' 주차 공간이 현재 여유로워요.",
      "실시간 인기 코스: '에너지 발산 60분 순삭 동선'",
      "현재 48명의 부모님이 함께 정보를 탐색하고 있습니다."
    ];
    let i = 0;
    const interval = setInterval(() => { setTickerMsg(msgs[++i % msgs.length]); }, 5000);

    return () => { unsubP(); unsubC(); unsubB(); unsubR(); unsubReq(); clearInterval(interval); };
  }, [user]);

  // 3. AI 가이드 (Gemini)
  const getAiTip = async (item, type) => {
    setIsAiLoading(true);
    setAiResult("");
    const ageLabel = AGE_GROUPS.find(g => g.id === selectedAge)?.name;
    const prompt = `대상: ${item.name || item.title}. ${ageLabel} 아이와 방문할 때 부모가 가장 먼저 챙겨야 할 실전 꿀팁 3가지를 한국어로 알려줘.`;

    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const result = await resp.json();
      setAiResult(result.candidates?.[0]?.content?.parts?.[0]?.text || "분석 결과를 불러올 수 없습니다.");
    } catch (err) { setAiResult("AI 가이드 연결 실패"); }
    setIsAiLoading(false);
  };

  // 4. 핸들러
  const handleItemClick = async (item, type) => {
    setSelectedItem(item);
    getAiTip(item, type);
    if (user) {
      const rDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'recentViews', item.id);
      await setDoc(rDoc, { ...item, viewedAt: Date.now(), type });
    }
  };

  const toggleBookmark = async (e, id) => {
    e.stopPropagation();
    if (!user) return;
    const bDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'bookmarks', id);
    if (bookmarks.includes(id)) { await deleteDoc(bDoc); }
    else { await setDoc(bDoc, { addedAt: Date.now() }); }
  };

  const submitSuggest = async () => {
    if (!user || !suggestData.name) return;
    const reqCol = collection(db, 'artifacts', appId, 'public', 'data', 'requests');
    await addDoc(reqCol, { ...suggestData, userId: user.uid, createdAt: serverTimestamp() });
    setShowSuggestModal(false);
    setSuggestData({ name: '', address: '', reason: '' });
  };

  const approveRequest = async (req) => {
    const pCol = collection(db, 'artifacts', appId, 'public', 'data', 'places');
    await addDoc(pCol, {
      name: req.name,
      address: req.address || "주소 정보 확인 중",
      category: 'restaurant',
      targetAges: ['baby', 'toddler', 'child'],
      amenities: ['아기의자', '유모차통로'],
      rating: 5.0,
      isNew: true, // 신규 뱃지 활성화
      liveCount: 1,
      createdAt: serverTimestamp()
    });
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'requests', req.id));
  };

  const openNavigation = (appName) => {
    if (!selectedItem) return;
    const target = selectedItem.steps ? selectedItem.steps[0] : selectedItem;
    const { lat, lng, name } = target;
    const schemes = {
      kakao: `kakaomap://route?ep=${lat},${lng}&by=CAR`,
      naver: `nmap://navigation?dlat=${lat}&dlng=${lng}&dname=${encodeURIComponent(name)}`,
      tmap: `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodeURIComponent(name)}`
    };
    window.location.href = schemes[appName] || schemes.kakao;
    setShowNavOptions(false);
  };

  const getLinkedCourses = (placeId) => courses.filter(c => c.steps.some(step => step.placeId === placeId));

  const filteredPlaces = useMemo(() => places.filter(p => (activeCategory === 'all' || p.category === activeCategory) && p.targetAges.includes(selectedAge)), [places, activeCategory, selectedAge]);
  const filteredCourses = useMemo(() => courses.filter(c => (activeConcept === 'all' || c.concept === activeConcept)), [courses, activeConcept]);

  if (!user) return <div className="h-screen flex items-center justify-center text-amber-500 animate-pulse text-4xl">🍼</div>;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      
      {/* Header & Ticker */}
      <header className="bg-white px-6 pt-12 pb-4 border-b border-stone-100 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-black italic text-amber-600 tracking-tighter">육아똑똑</h1>
          <div className="flex items-center gap-2">
             <div className="bg-stone-100 px-3 py-1.5 rounded-full text-[10px] font-black text-stone-400">📍 파주시 운정동</div>
             <button onClick={() => setViewMode('admin')} className="w-8 h-8 bg-stone-900 text-white rounded-full text-[9px] font-black">Admin</button>
          </div>
        </div>

        {/* 실시간 티커 영역 */}
        <div className="bg-amber-50 rounded-xl px-4 py-2.5 mb-4 overflow-hidden">
           <div className="flex items-center gap-3 animate-fadeIn">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
              <p className="text-[11px] font-black text-amber-700 truncate tracking-tight">{tickerMsg}</p>
           </div>
        </div>

        {viewMode === 'explore' && (
          <div className="flex bg-stone-100 p-1 rounded-full mb-4 border border-stone-200">
             {AGE_GROUPS.map(age => (
               <button key={age.id} onClick={() => setSelectedAge(age.id)} className={`flex-grow h-8 rounded-full flex items-center justify-center text-sm transition-all ${selectedAge === age.id ? 'bg-white shadow-md scale-105' : 'opacity-20 grayscale'}`}>
                 <span className="text-base">{age.icon}</span>
               </button>
             ))}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {viewMode === 'explore' ? CATEGORIES.map(cat => (
             <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 px-4 py-2 rounded-2xl border-2 transition-all font-black text-xs ${activeCategory === cat.id ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-stone-100 text-stone-400'}`}>
                {cat.icon} {cat.name}
             </button>
          )) : viewMode === 'course' ? CONCEPTS.map(con => (
             <button key={con.id} onClick={() => setActiveConcept(con.id)} className={`flex-shrink-0 px-4 py-2 rounded-2xl border-2 transition-all font-black text-xs ${activeConcept === con.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-stone-100 text-stone-400'}`}>
                {con.icon} {con.name}
             </button>
          )) : null}
        </div>
      </header>

      {/* Main List Area */}
      <main className="flex-grow overflow-y-auto px-6 py-6 pb-32 no-scrollbar">
        {viewMode === 'explore' && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">맞춤 장소 {filteredPlaces.length}선</h3>
            {filteredPlaces.map(place => (
              <div key={place.id} onClick={() => handleItemClick(place, 'place')} className="bg-white p-5 rounded-[2.5rem] border border-stone-100 shadow-sm flex gap-5 active:scale-[0.98] transition-all cursor-pointer relative group">
                {place.isNew && <div className="absolute top-5 right-20 bg-blue-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-md">NEW</div>}
                {place.liveCount > 10 && <div className="absolute top-5 right-12 bg-red-50 text-red-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-red-100">{place.liveCount}명</div>}
                <button onClick={(e) => toggleBookmark(e, place.id)} className="absolute top-4 right-6 text-xl z-10">{bookmarks.includes(place.id) ? '❤️' : '🤍'}</button>
                <div className="w-16 h-16 bg-stone-50 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center text-3xl shadow-inner group-hover:bg-amber-50">
                   {CATEGORIES.find(c => c.id === place.category)?.icon || '📍'}
                </div>
                <div className="flex-grow py-1 pr-8">
                  <h3 className="font-black text-stone-800 text-sm leading-tight mb-3 pr-12">{place.name}</h3>
                  <div className="flex gap-2">
                     {ESSENTIAL_ITEMS.map(item => (
                        <span key={item.id} className={`text-sm ${place.amenities?.includes(item.name) ? 'opacity-100' : 'opacity-10 grayscale'}`}>
                           {item.icon}
                        </span>
                     ))}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setShowSuggestModal(true)} className="w-full py-12 bg-white border-2 border-dashed border-stone-100 rounded-[2.5rem] text-xs font-black text-stone-300">새로운 장소 추천하기 ➕</button>
          </div>
        )}

        {viewMode === 'course' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">추천 나들이 코스</h3>
            {filteredCourses.map(course => (
              <div key={course.id} onClick={() => handleItemClick(course, 'course')} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8 active:scale-[0.98] transition-all cursor-pointer">
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase mb-4 inline-block">{CONCEPTS.find(c => c.id === course.concept)?.name}</span>
                <h4 className="text-lg font-black text-stone-800 leading-tight mb-6">{course.title}</h4>
                <div className="flex items-center gap-3 text-[11px] font-bold text-stone-400">
                   <span>{course.steps[0].name}</span><span className="text-stone-100">▶</span><span>{course.steps[1].name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'my' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="text-center pt-6">
               <div className="w-20 h-20 bg-stone-900 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl">👤</div>
               <h2 className="text-2xl font-black tracking-tighter">나들이 가방</h2>
            </div>
            <section>
              <h3 className="text-sm font-black mb-4 px-2">⭐ 내가 찜한 장소 {bookmarks.length}</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                 {places.filter(p => bookmarks.includes(p.id)).map(p => (
                   <div key={p.id} onClick={() => handleItemClick(p, 'place')} className="flex-shrink-0 w-32 bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm text-center">
                      <div className="text-3xl mb-2">{CATEGORIES.find(c => c.id === p.category)?.icon}</div>
                      <p className="text-[9px] font-black truncate">{p.name}</p>
                   </div>
                 ))}
              </div>
            </section>
            <section>
               <h3 className="text-sm font-black mb-4 px-2">🕒 최근 본 정보</h3>
               <div className="space-y-2">
                  {recentViews.map(view => (
                    <div key={view.id} onClick={() => handleItemClick(view, view.type)} className="bg-white p-4 rounded-3xl border border-stone-50 flex items-center gap-4 cursor-pointer">
                       <span className="text-xl">{view.type === 'course' ? '✨' : '📍'}</span>
                       <span className="text-xs font-bold text-stone-700 truncate">{view.name || view.title}</span>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        )}

        {viewMode === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end">
               <h2 className="text-2xl font-black">Admin 대시보드</h2>
               <button onClick={() => setViewMode('explore')} className="text-xs font-bold text-stone-300 underline">나가기</button>
            </div>
            <section className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
               <h3 className="text-sm font-black mb-4 flex items-center gap-2">📝 장소 추가 요청 <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full">{adminRequests.length}</span></h3>
               <div className="space-y-3">
                  {adminRequests.map(req => (
                    <div key={req.id} className="p-4 border border-stone-50 bg-stone-50 rounded-2xl">
                       <h4 className="text-sm font-black mb-1">{req.name}</h4>
                       <p className="text-[10px] text-stone-400 mb-4">{req.reason}</p>
                       <div className="flex gap-2">
                          <button onClick={() => approveRequest(req)} className="flex-grow bg-stone-900 text-white py-2 rounded-xl text-[10px] font-black shadow-md">승인 및 등록</button>
                          <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'requests', req.id))} className="px-3 bg-white text-stone-300 py-2 rounded-xl text-[10px] font-black border border-stone-100">삭제</button>
                       </div>
                    </div>
                  ))}
                  {adminRequests.length === 0 && <p className="text-center py-10 text-xs text-stone-200">새로운 요청이 없습니다.</p>}
               </div>
            </section>
          </div>
        )}
      </main>

      {/* 상세보기 모달 (시설 흑백 처리 기능 탑재) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => { setSelectedItem(null); setShowNavOptions(false); }}></div>
          <div className="bg-white w-full max-w-md rounded-t-[4rem] p-8 pb-16 z-50 animate-slideUp max-h-[94vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="w-16 h-1.5 bg-stone-200 rounded-full mx-auto mb-10 cursor-pointer" onClick={() => setSelectedItem(null)}></div>
            
            {!selectedItem.steps ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase border border-blue-100">{selectedItem.category}</span>
                    <h2 className="text-3xl font-black text-stone-900 tracking-tighter leading-tight">{selectedItem.name}</h2>
                    <p className="text-sm font-bold text-stone-400">{selectedItem.address}</p>
                  </div>
                  <button onClick={(e) => toggleBookmark(e, selectedItem.id)} className="text-2xl active:scale-125 transition-transform">{bookmarks.includes(selectedItem.id) ? '❤️' : '🤍'}</button>
                </div>

                <div className="bg-amber-50 rounded-[2.5rem] p-6 mb-8 border border-amber-100 flex gap-4">
                   <div className="text-3xl">🍯</div>
                   <div>
                      <h4 className="text-xs font-black text-amber-800 mb-1">실전 외출 꿀팁</h4>
                      <p className="text-sm font-bold text-amber-950 leading-relaxed italic">{selectedItem.honeyTip || "유모차 동선이 완벽해서 별도의 준비물 없이도 쾌적하게 머물 수 있습니다."}</p>
                      {selectedItem.packingItems && <p className="text-[10px] font-black text-amber-700/60 mt-3 tracking-tight">챙길 것: {selectedItem.packingItems}</p>}
                   </div>
                </div>

                {/* 고도화: 시설 정보 (전체 노출 + 없는 것 흑백 처리) */}
                <h4 className="text-xs font-black text-stone-400 mb-4 uppercase tracking-widest flex items-center gap-2">시설 및 편의 정보 <span className="w-full h-px bg-stone-100"></span></h4>
                <div className="grid grid-cols-4 gap-3 mb-10">
                   {ALL_AMENITIES_LIST.map(a => {
                     const isAvailable = selectedItem.amenities?.includes(a);
                     return (
                       <div key={a} className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-300 ${isAvailable ? 'border-amber-100 bg-white shadow-sm' : 'border-stone-50 bg-stone-50/50 opacity-20 grayscale'}`}>
                          <span className="text-2xl">{AMENITY_ICONS[a] || '✅'}</span>
                          <span className="text-[9px] font-black text-stone-600 text-center whitespace-nowrap">{a}</span>
                       </div>
                     );
                   })}
                   <div className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 shadow-sm ${selectedItem.parkingInfo && !selectedItem.parkingInfo.includes('협소') ? 'border-blue-100 bg-white' : 'border-red-100 bg-red-50/20'}`}>
                      <span className="text-2xl">{selectedItem.parkingInfo?.includes('협소') ? '⚠️' : '🅿️'}</span>
                      <span className="text-[9px] font-black text-stone-600 text-center">{selectedItem.parkingInfo || '주차정보없음'}</span>
                   </div>
                </div>

                {/* 연계 추천 코스 */}
                <h4 className="text-xs font-black text-stone-400 mb-4 uppercase tracking-widest flex items-center gap-2">함께 가기 좋은 코스 <span className="w-full h-px bg-stone-100"></span></h4>
                <div className="flex gap-4 overflow-x-auto no-scrollbar mb-10 pb-2">
                  {getLinkedCourses(selectedItem.id).length > 0 ? (
                    getLinkedCourses(selectedItem.id).map(course => (
                      <div key={course.id} onClick={() => handleItemClick(course, 'course')} className="flex-shrink-0 w-64 bg-stone-900 p-6 rounded-[2.5rem] shadow-xl cursor-pointer active:scale-95 transition-transform">
                         <span className="text-[9px] font-black text-amber-400 bg-white/10 px-2 py-0.5 rounded-full mb-3 inline-block">추천 동선</span>
                         <h5 className="text-sm font-black text-white line-clamp-2 leading-tight">{course.title}</h5>
                      </div>
                    ))
                  ) : <p className="text-[10px] text-stone-300 font-bold px-2">등록된 추천 동선이 없습니다.</p>}
                </div>
              </>
            ) : (
              /* 코스 상세보기 */
              <>
                <h2 className="text-2xl font-black text-stone-900 leading-tight mb-8 tracking-tight italic">{selectedItem.title}</h2>
                <div className="relative pl-10 space-y-12 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                  {selectedItem.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-blue-500 text-white shadow-lg' : 'bg-amber-500 text-white shadow-lg'}`}>
                        {idx + 1}
                      </div>
                      <div className="bg-stone-50 rounded-[2.5rem] p-6 border border-stone-100">
                        <h4 className="font-black text-stone-800 mb-2">{step.name}</h4>
                        <p className="text-xs text-stone-500 font-bold leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* AI 전략 섹션 */}
            <div className="bg-amber-500 text-white rounded-[3.5rem] p-8 shadow-2xl animate-fadeIn relative overflow-hidden mt-4">
              <h4 className="text-sm font-black text-amber-100 mb-4 tracking-tighter">✨ AI 육아 전문가의 최종 조언</h4>
              {isAiLoading ? <div className="py-4 text-center font-black animate-pulse text-xs tracking-widest">전략 분석 중...</div> : <p className="text-[13px] font-bold leading-relaxed whitespace-pre-wrap">{aiResult || "분석 정보를 불러오는 중입니다."}</p>}
            </div>

            <button onClick={() => setShowNavOptions(!showNavOptions)} className="w-full bg-stone-900 text-white py-6 rounded-[2.5rem] font-black mt-10 shadow-xl active:scale-95 transition-all">🚗 길찾기 시작</button>
            {showNavOptions && (
              <div className="grid grid-cols-3 gap-2 mt-4 animate-slideUp">
                 <button onClick={() => openNavigation('kakao')} className="bg-yellow-50 py-3 rounded-2xl text-[10px] font-black shadow-sm">카카오</button>
                 <button onClick={() => openNavigation('naver')} className="bg-green-50 py-3 rounded-2xl text-[10px] font-black shadow-sm">네이버</button>
                 <button onClick={() => openNavigation('tmap')} className="bg-red-50 py-3 rounded-2xl text-[10px] font-black shadow-sm">Tmap</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 제안 모달 */}
      {showSuggestModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSuggestModal(false)}></div>
            <div className="bg-white w-full rounded-[3rem] p-8 z-[110] shadow-2xl animate-slideUp">
               <h3 className="text-xl font-black mb-6">새로운 장소 제안</h3>
               <div className="space-y-4 mb-8">
                  <input placeholder="장소 이름" className="w-full bg-stone-50 p-4 rounded-2xl text-sm font-bold border-none shadow-inner" value={suggestData.name} onChange={e => setSuggestData({...suggestData, name: e.target.value})} />
                  <textarea placeholder="추천 이유" className="w-full bg-stone-50 p-4 rounded-2xl text-sm font-bold h-32 resize-none border-none shadow-inner" value={suggestData.reason} onChange={e => setSuggestData({...suggestData, reason: e.target.value})} />
               </div>
               <button onClick={submitSuggest} className="w-full bg-stone-900 text-white py-5 rounded-[2rem] font-black shadow-lg">제안서 제출하기</button>
            </div>
         </div>
      )}

      {/* Footer Nav */}
      <div className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-2xl border-t border-stone-100 px-10 py-4 pb-12 flex justify-between z-40 rounded-t-[3.5rem] shadow-2xl">
        <button onClick={() => setViewMode('explore')} className={`flex flex-col items-center gap-1.5 ${viewMode === 'explore' ? 'text-amber-600 scale-110' : 'text-stone-300'}`}>
          <span className="text-2xl transition-transform">🗺️</span><span className="text-[9px] font-black uppercase">탐색</span>
        </button>
        <button onClick={() => setViewMode('course')} className={`flex flex-col items-center gap-1.5 ${viewMode === 'course' ? 'text-indigo-600 scale-110' : 'text-stone-300'}`}>
          <span className="text-2xl transition-transform">✨</span><span className="text-[9px] font-black uppercase">코스</span>
        </button>
        <button onClick={() => setViewMode('my')} className={`flex flex-col items-center gap-1.5 ${viewMode === 'my' ? 'text-amber-600 scale-110' : 'text-stone-300'}`}>
          <span className="text-2xl transition-transform">👤</span><span className="text-[9px] font-black uppercase">마이</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}} />
    </div>
  );
}

// --- 고도화된 Mock 데이터 ---
function getMockPlaces() {
  return [
    { 
      id: 'p1', name: '식당A (안심 육아 식당)', category: 'restaurant', address: '경기도 파주시 문발동 123', 
      lat: 37.7126, lng: 126.6975, targetAges: ['baby', 'toddler'], liveCount: 15,
      amenities: ['아기의자', '유모차통로', '기저귀대', '전자레인지', '키즈메뉴'], rating: 4.8, isNew: false,
      parkingInfo: '주차무료 (넉넉함)', honeyTip: "창가 좌석이 유모차를 두기에 아주 넓고 좋습니다.", packingItems: "턱받이, 아기 수저"
    },
    { 
      id: 'p2', name: '카페B (감성 힐링 존)', category: 'cafe', address: '경기도 파주시 문발동 456', 
      lat: 37.7259, lng: 126.7588, targetAges: ['toddler', 'child'], liveCount: 12,
      amenities: ['좌식공간', '유모차통로'], rating: 4.5, isNew: true,
      parkingInfo: '주차협소', honeyTip: "좌식 테이블은 인기가 많으니 오픈 시간에 맞춰 가세요."
    },
    { 
      id: 'p3', name: '놀이터C (실내 체험관)', category: 'activity', address: '경기도 고양시 덕양구 789', 
      lat: 37.6468, lng: 126.8973, targetAges: ['baby', 'toddler', 'child'], liveCount: 42,
      amenities: ['수유실', '기저귀대', '전자레인지', '유모차통로', '아기의자'], rating: 4.9, isNew: false,
      parkingInfo: '주차매우여유', packingItems: "양말 필수 착용"
    },
  ];
}

function getMockCourses() {
  return [
    {
      id: 'c1', title: '파주 주말 순삭 코스 (식사+카페)', concept: 'energy', transitTime: '10분',
      steps: [
        { placeId: 'p1', name: '식당A', desc: '아기와 함께 편안하게 식사하세요.' },
        { placeId: 'p2', name: '카페B', desc: '식후 시원한 커피와 아기 간식 시간!' }
      ]
    },
    {
       id: 'c2', title: '에너지 발산 힐링 코스', concept: 'energy', transitTime: '15분',
       steps: [
         { placeId: 'p3', name: '놀이터C', desc: '신나게 뛰어놀며 에너지를 발산해요.' },
         { placeId: 'p2', name: '카페B', desc: '놀이 후 엄마 아빠의 휴식 시간.' }
       ]
    }
  ];
}