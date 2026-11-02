import React, { useState, useEffect } from 'react';

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cinelist_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Film');
  const [genre, setGenre] = useState('Aksiyon');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState('İzlenecek');
  const [filterGenre, setFilterGenre] = useState('Tümü');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('cinelist_data', JSON.stringify(items));
  }, [items]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newItem = { id: Date.now(), title, type, genre, rating: Number(rating), status };
    setItems([newItem, ...items]);
    setTitle('');
  };

  const toggleStatus = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: item.status === 'İzlendi' ? 'İzlenecek' : 'İzlendi' } : item
    ));
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    const matchesGenre = filterGenre === 'Tümü' || item.genre === filterGenre;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const totalWatched = items.filter(i => i.status === 'İzlendi').length;
  const avgRating = items.length ? (items.reduce((acc, i) => acc + i.rating, 0) / items.length).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Başlık */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-indigo-400">🎬 CineList</h1>
          <p className="text-slate-400">Dizi & Film İzleme Listesi ve İnceleme Defteri</p>
        </header>

        {/* İstatistik Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <span className="text-slate-400 text-sm block">Toplam İçerik</span>
            <span className="text-3xl font-bold text-indigo-400">{items.length}</span>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <span className="text-slate-400 text-sm block">İzlenenler</span>
            <span className="text-3xl font-bold text-emerald-400">{totalWatched}</span>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
            <span className="text-slate-400 text-sm block">Ortalama Puan</span>
            <span className="text-3xl font-bold text-amber-400">★ {avgRating}</span>
          </div>
        </div>

        {/* Ekleme Formu */}
        <form onSubmit={handleAdd} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">Yeni Film / Dizi Ekle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input 
              type="text" 
              placeholder="İçerik Adı..." 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 md:col-span-2"
            />
            <select value={type} onChange={e => setType(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100">
              <option value="Film">Film</option>
              <option value="Dizi">Dizi</option>
            </select>
            <select value={genre} onChange={e => setGenre(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100">
              <option value="Aksiyon">Aksiyon</option>
              <option value="Dram">Dram</option>
              <option value="Komedi">Komedi</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Korku">Korku</option>
              <option value="Belgesel">Belgesel</option>
            </select>
            <select value={rating} onChange={e => setRating(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100">
              {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Yıldız ★</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-medium p-2.5 rounded-lg text-sm transition">
            Listeye Ekle
          </button>
        </form>

        {/* Filtreleme ve Arama */}
        <div className="flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Listede ara..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100"
          />
          <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100">
            <option value="Tümü">Tüm Türler</option>
            <option value="Aksiyon">Aksiyon</option>
            <option value="Dram">Dram</option>
            <option value="Komedi">Komedi</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Korku">Korku</option>
            <option value="Belgesel">Belgesel</option>
          </select>
        </div>

        {/* Liste */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Henüz eklenmiş bir içerik bulunmuyor.</p>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-100">{item.title}</h3>
                    <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">{item.type}</span>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{item.genre}</span>
                  </div>
                  <div className="text-amber-400 text-sm font-medium">{'★'.repeat(item.rating)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(item.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                      item.status === 'İzlendi' 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    {item.status}
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-xs bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 px-3 py-1.5 rounded-lg transition"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}