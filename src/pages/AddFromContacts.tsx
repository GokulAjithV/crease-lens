import React, { useState } from 'react';
import { ArrowLeft, Search, X, Check, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  name: string;
  phone: string;
  initial: string;
  color: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Aakash Verma', phone: '+91 98765 43210', initial: 'A', color: '#ef4444' },
  { id: '2', name: 'Amit Patel', phone: '+91 87654 32109', initial: 'A', color: '#f59e0b' },
  { id: '3', name: 'Bharat Singh', phone: '+91 76543 21098', initial: 'B', color: '#10b981' },
  { id: '4', name: 'Ravi Kumar', phone: '+91 65432 10987', initial: 'R', color: '#3b82f6' },
  { id: '5', name: 'Rahul Dravid', phone: '+91 54321 09876', initial: 'R', color: '#a855f7' },
  { id: '6', name: 'Sachin T.', phone: '+91 43210 98765', initial: 'S', color: '#ec4899' },
  { id: '7', name: 'Suresh Raina', phone: '+91 32109 87654', initial: 'S', color: '#06b6d4' },
];

export default function AddFromContacts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [added, setAdded] = useState<Set<string>>(new Set());

  const filteredContacts = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by first letter
  const grouped: Record<string, Contact[]> = {};
  filteredContacts.forEach((c) => {
    const letter = c.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });

  const toggleAdd = (id: string) => {
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#ffffff]">Add Players</h1>
        </div>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <User size={20} />
        </button>
      </header>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#a855f7] transition-colors">
          <Search size={16} className="text-[#565555] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-transparent text-sm text-[#ffffff] outline-none placeholder:text-[#565555]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Contacts List */}
      <main className="px-4 pb-32 space-y-4">
        {Object.keys(grouped).sort().map((letter) => (
          <section key={letter}>
            <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase mb-2 px-1">{letter}</h3>
            <div className="space-y-1.5">
              {grouped[letter].map((contact) => {
                const isAdded = added.has(contact.id);
                return (
                  <div key={contact.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#111] transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: contact.color }}
                      >
                        <span className="text-sm font-bold text-[#ffffff]">{contact.initial}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#ffffff] block">{contact.name}</span>
                        <span className="text-[11px] text-[#a3a3a3]">{contact.phone}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAdd(contact.id)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                        isAdded
                          ? 'bg-[#a855f7] text-[#ffffff]'
                          : 'border border-[#a3a3a3] text-[#a3a3a3] hover:border-[#ffffff] hover:text-[#ffffff]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={10} />
                          Added
                        </>
                      ) : (
                        'Add +'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 w-full max-w-[390px] bg-gradient-to-t from-[#000000] via-[#000000] to-transparent px-4 pt-6 pb-8 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-[#a855f7] text-[#ffffff] py-4 rounded-2xl font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[#c799ff] active:scale-[0.98] transition-all"
        >
          Done{added.size > 0 ? ` (${added.size} added)` : ''}
        </button>
      </div>
    </div>
  );
}
