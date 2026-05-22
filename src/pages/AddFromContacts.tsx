import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, X, Check, User, Loader2, BookUser, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { teamId } = useParams<{ teamId: string }>();

  const [search, setSearch] = useState('');
  const [squadPhones, setSquadPhones] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [loadingSquad, setLoadingSquad] = useState(true);
  const [addingStatus, setAddingStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});
  const [isContactsApiSupported, setIsContactsApiSupported] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Group filtered contacts by first letter
  const filteredContacts = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped: Record<string, Contact[]> = {};
  filteredContacts.forEach((c) => {
    const letter = c.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });

  // Check Contacts API support and fetch squad on mount
  useEffect(() => {
    const supported = !!((navigator as any).contacts && 'select' in (navigator as any).contacts);
    setIsContactsApiSupported(supported);
    fetchTeamSquad();
  }, [teamId]);

  const fetchTeamSquad = async () => {
    if (!teamId) return;
    try {
      setLoadingSquad(true);
      setError('');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/teams/${teamId}/players`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team squad');
      }

      const data = await response.json();
      const playersList = data.data?.players || [];
      const phones = new Set<string>();
      playersList.forEach((p: any) => {
        if (p.phone) {
          phones.add(p.phone);
        }
      });
      setSquadPhones(phones);
    } catch (err: any) {
      console.error(err);
      setError('Could not sync current team squad players');
    } finally {
      setLoadingSquad(false);
    }
  };

  const addContactToTeam = async (name: string, rawPhone: string, contactId: string) => {
    if (!teamId) return;

    // Format phone number
    let cleanPhone = rawPhone.replace(/\s+/g, '');
    let searchPhone = cleanPhone;
    if (/^\d{10}$/.test(cleanPhone)) {
      searchPhone = `+91${cleanPhone}`;
    }

    // Normalizing for duplicate checks
    const normalizedSearch = searchPhone.replace(/\D/g, '');
    const isAlreadyInTeam = Array.from(squadPhones).some(p => p.replace(/\D/g, '') === normalizedSearch);

    if (isAlreadyInTeam) {
      setAddingStatus(prev => ({ ...prev, [contactId]: 'success' }));
      return;
    }

    try {
      setAddingStatus(prev => ({ ...prev, [contactId]: 'loading' }));
      setError('');
      setSuccessMsg('');

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');

      // 1. Search player by phone
      const searchRes = await fetch(`${API_URL}/api/players/search?phone=${encodeURIComponent(searchPhone)}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!searchRes.ok) {
        throw new Error('Search request failed');
      }

      const searchData = await searchRes.json();
      let payload: any = {};

      if (searchData.data) {
        // Player found in registry
        payload = {
          player_id: searchData.data.id,
          role: 'BAT',
        };
      } else {
        // Add as guest player
        payload = {
          guest_name: name,
          guest_phone: searchPhone,
          role: 'BAT',
        };
      }

      // 2. Add player/guest to team squad
      const addRes = await fetch(`${API_URL}/api/teams/${teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!addRes.ok) {
        const errData = await addRes.json();
        throw new Error(errData.detail || 'Failed to add contact player');
      }

      setAddingStatus(prev => ({ ...prev, [contactId]: 'success' }));
      setSquadPhones(prev => {
        const next = new Set(prev);
        next.add(searchPhone);
        return next;
      });
      setAdded(prev => {
        const next = new Set(prev);
        next.add(contactId);
        return next;
      });
      setSuccessMsg(`Added ${name} to squad!`);
    } catch (err: any) {
      console.error(err);
      setAddingStatus(prev => ({ ...prev, [contactId]: 'error' }));
      setError(err.message || `Failed to add ${name}`);
    }
  };

  const handleDeviceContactsPick = async () => {
    try {
      setError('');
      setSuccessMsg('');
      const props = ['name', 'tel'];
      const opts = { multiple: true };
      const selected = await (navigator as any).contacts.select(props, opts);

      if (selected && selected.length > 0) {
        let addedCount = 0;
        for (const c of selected) {
          const name = c.name?.[0] || 'Contact';
          const phone = c.tel?.[0];
          if (phone) {
            const tempId = `device-${phone}-${Math.random()}`;
            await addContactToTeam(name, phone, tempId);
            addedCount++;
          }
        }
        if (addedCount > 0) {
          setSuccessMsg(`Successfully processed ${addedCount} contacts!`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to open device contacts picker');
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[#000000] text-[#ffffff] font-sans relative overflow-x-hidden shadow-2xl">
      {/* Toast Notification */}
      {successMsg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#10b981] text-black px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 z-[100] animate-bounce">
          <Check size={14} strokeWidth={3} />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 bg-[#000000]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-[#ffffff]">Add from Contacts</h1>
        </div>
        <button className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors">
          <User size={20} />
        </button>
      </header>

      {/* Main Content */}
      <div className="px-4 pb-4">
        {error && (
          <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-3 text-center text-xs text-[#ef4444] flex items-center justify-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Contacts API Picker */}
        {isContactsApiSupported ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-[#a855f7]/20 flex flex-col gap-3 items-center text-center">
            <BookUser className="text-[#c799ff]" size={32} />
            <div>
              <h4 className="text-sm font-bold text-white">Device Address Book</h4>
              <p className="text-xs text-[#a3a3a3] mt-1 leading-relaxed">
                Directly select contacts from your phone's address book.
              </p>
            </div>
            <button
              onClick={handleDeviceContactsPick}
              className="w-full bg-[#a855f7] hover:bg-[#c799ff] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_4px_12px_rgba(168,85,247,0.2)]"
            >
              Open Contact Picker
            </button>
          </div>
        ) : (
          <div className="bg-[#111111] rounded-xl px-4 py-3 mb-4 text-center border border-dashed border-[#222222]">
            <span className="text-[10px] text-[#888888] font-medium leading-relaxed block">
              Device Contacts Picker is supported on Android/iOS mobile browsers. Showing simulated contacts below.
            </span>
          </div>
        )}

        {/* Search Bar */}
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
        {loadingSquad && (
          <div className="flex items-center justify-center py-8 gap-2 text-xs text-[#a3a3a3]">
            <Loader2 size={16} className="animate-spin text-[#a855f7]" />
            <span>Syncing squad database...</span>
          </div>
        )}

        {!loadingSquad && Object.keys(grouped).length === 0 && (
          <div className="text-center py-8 text-xs text-[#565555]">
            No matching contacts found.
          </div>
        )}

        {!loadingSquad && Object.keys(grouped).sort().map((letter) => (
          <section key={letter}>
            <h3 className="text-[10px] font-bold text-[#565555] tracking-widest uppercase mb-2 px-1">{letter}</h3>
            <div className="space-y-1.5">
              {grouped[letter].map((contact) => {
                const status = addingStatus[contact.id];
                const normalized = contact.phone.replace(/\D/g, '');
                const isAlreadyInTeam = Array.from(squadPhones).some(p => p.replace(/\D/g, '') === normalized);
                const isAdded = isAlreadyInTeam || added.has(contact.id);

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
                      onClick={() => addContactToTeam(contact.name, contact.phone, contact.id)}
                      disabled={isAdded || status === 'loading'}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                        isAdded
                          ? 'bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366]'
                          : status === 'loading'
                          ? 'bg-[#1a1a1a] text-[#a3a3a3] border border-transparent'
                          : 'border border-[#a3a3a3] text-[#a3a3a3] hover:border-[#ffffff] hover:text-[#ffffff]'
                      }`}
                    >
                      {status === 'loading' ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : isAdded ? (
                        <>
                          <Check size={10} strokeWidth={3} />
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
