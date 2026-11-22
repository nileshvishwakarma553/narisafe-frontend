import React, { useState, useEffect } from 'react';
import { PhoneCall, Shield, Phone, Search, Building2, HeartHandshake } from 'lucide-react';
import api from '../services/api';

const EmergencyHelplinesPage = () => {
  const [helplines, setHelplines] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Verified Indian National Helplines as immediate baseline
  const defaultHelplines = [
    {
      _id: '1',
      name: 'National Emergency Response Support System (ERSS)',
      number: '112',
      category: 'Emergency',
      description: 'Unified pan-India emergency number for immediate Police, Fire, Ambulance, and Rescue.',
      availableHours: '24x7',
      isNational: true,
    },
    {
      _id: '2',
      name: 'Women Helpline (Domestic Violence & Distress)',
      number: '181',
      category: 'Women Safety',
      description: 'National 24x7 toll-free emergency response and shelter referral for women facing violence.',
      availableHours: '24x7',
      isNational: true,
    },
    {
      _id: '3',
      name: 'Police Women Special Cell (Women in Distress)',
      number: '1091',
      category: 'Police',
      description: 'Dedicated police helpline for quick dispatch during street harassment, stalking, or distress.',
      availableHours: '24x7',
      isNational: true,
    },
    {
      _id: '4',
      name: 'Police Emergency Response',
      number: '100',
      category: 'Police',
      description: 'Direct police control room dispatch across all states and districts.',
      availableHours: '24x7',
      isNational: true,
    },
    {
      _id: '5',
      name: 'Emergency Medical Ambulance Service',
      number: '108',
      category: 'Medical',
      description: 'Toll-free emergency medical transport, ambulance dispatch, and trauma care response.',
      availableHours: '24x7',
      isNational: true,
    },
    {
      _id: '6',
      name: 'Childline Emergency Care & Protection',
      number: '1098',
      category: 'Child',
      description: '24x7 nationwide helpline for children and minors in distress or needing protection.',
      availableHours: '24x7',
      isNational: true,
    },
    {
      _id: '7',
      name: 'National Cyber Crime Reporting Helpline',
      number: '1930',
      category: 'Cyber Crime',
      description: 'Dedicated portal and phone assistance for reporting cyber harassment, morphing, and fraud.',
      availableHours: '24x7',
      isNational: true,
    },
    {
      _id: '8',
      name: 'National Commission for Women (NCW)',
      number: '7827170170',
      category: 'Legal Aid',
      description: 'NCW 24x7 helpline for women in distress, workplace harassment, or needing legal counsel.',
      availableHours: '24x7',
      isNational: true,
    },
  ];

  useEffect(() => {
    const fetchHelplines = async () => {
      try {
        const res = await api.get('/helplines');
        if (res.data.success && res.data.data.length > 0) {
          setHelplines(res.data.data);
        } else {
          setHelplines(defaultHelplines);
        }
      } catch (err) {
        setHelplines(defaultHelplines);
      } finally {
        setLoading(false);
      }
    };

    fetchHelplines();
  }, []);

  const filtered = helplines.filter((h) => {
    const matchSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.number.includes(search) ||
      h.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || h.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-purple-700" />
          Emergency Helpline Directory (India)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct toll-free lines for immediate police dispatch, women's distress helplines, trauma ambulances, and cyber crime aid.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-soft-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, number, or service (e.g. 112, harassment, legal)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-purple-600 outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Emergency">Emergency (112)</option>
          <option value="Women Safety">Women Safety (181)</option>
          <option value="Police">Police (1091 / 100)</option>
          <option value="Medical">Medical (108)</option>
          <option value="Cyber Crime">Cyber Crime (1930)</option>
          <option value="Legal Aid">Legal Aid & NCW</option>
        </select>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="p-6 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {item.availableHours || '24x7'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-2xl font-black text-purple-900 font-mono mb-2">{item.number}</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
            </div>

            <a
              href={`tel:${item.number}`}
              className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Tap to Call {item.number}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyHelplinesPage;
