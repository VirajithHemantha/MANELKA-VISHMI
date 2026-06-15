import React, { useState, useEffect } from "react";
import { Copy, Link2, Trash2, Check } from "lucide-react";

type GeneratedLink = {
  id: string;
  name: string;
  url: string;
  date: string;
};

export default function AdminPage() {
  const [prefix, setPrefix] = useState("Mr. & Mrs.");
  const [guestName, setGuestName] = useState("");
  const [links, setLinks] = useState<GeneratedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("wedding_generated_links");
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveLinks = (newLinks: GeneratedLink[]) => {
    setLinks(newLinks);
    localStorage.setItem("wedding_generated_links", JSON.stringify(newLinks));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const fullName = prefix ? `${prefix} ${guestName.trim()}` : guestName.trim();
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/?to=${encodeURIComponent(fullName)}`;
    
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newLink: GeneratedLink = {
      id: crypto.randomUUID(),
      name: fullName,
      url,
      date: dateStr,
    };

    saveLinks([newLink, ...links]);
    setGuestName("");
  };

  const handleCopy = (link: GeneratedLink) => {
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    saveLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-paper text-zinc-800 p-6 md:p-12 font-sans selection:bg-sage/20">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4 mt-8 md:mt-12">
          <h1 className="serif text-3xl md:text-5xl text-sage tracking-widest uppercase">
            Link Generator
          </h1>
          <p className="text-sm text-zinc-500 tracking-widest uppercase">
            Create personalized invitations
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-sage/20 p-6 md:p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Prefix</label>
                <select 
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full rounded-xl border border-sage/30 bg-white/80 px-4 py-3 text-sm text-zinc-800 outline-none focus:border-sage focus:ring-1 focus:ring-sage/50 transition-all"
                >
                  <option value="Mr. & Mrs.">Mr. & Mrs.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Rev.">Rev.</option>
                  <option value="">None</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Guest Name</label>
                <input 
                  type="text"
                  placeholder="e.g. John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full rounded-xl border border-sage/30 bg-white/80 px-4 py-3 text-sm text-zinc-800 outline-none focus:border-sage focus:ring-1 focus:ring-sage/50 transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={!guestName.trim()}
              className="w-full bg-sage hover:bg-sage/90 text-white rounded-xl py-3.5 text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Link2 size={16} />
              Generate Link
            </button>
          </form>
        </div>

        {links.length > 0 && (
          <div className="space-y-6">
            <h2 className="serif text-2xl text-sage/80 tracking-wider">Recently Generated Links</h2>
            <div className="grid gap-4">
              {links.map((link) => (
                <div key={link.id} className="bg-white/40 border border-sage/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-white/60">
                  <div className="space-y-1">
                    <p className="font-bold text-zinc-800 text-lg">{link.name}</p>
                    <p className="text-xs text-zinc-500 font-mono">{link.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopy(link)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-sage/10 hover:bg-sage/20 text-sage px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      {copiedId === link.id ? <Check size={16} /> : <Copy size={16} />}
                      {copiedId === link.id ? "Copied" : "Copy"}
                    </button>
                    <button 
                      onClick={() => handleDelete(link.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
