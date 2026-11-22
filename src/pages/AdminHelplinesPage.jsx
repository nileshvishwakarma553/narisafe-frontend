import React, { useState, useEffect } from 'react';
import { PhoneCall, Plus, Trash2, Edit2, CheckCircle, Shield } from 'lucide-react';
import api from '../services/api';

const AdminHelplinesPage = () => {
  const [helplines, setHelplines] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [category, setCategory] = useState('Women Safety');
  const [description, setDescription] = useState('');
  const [state, setState] = useState('National');
  const [isNational, setIsNational] = useState(true);
  const [message, setMessage] = useState('');

  const fetchHelplines = async () => {
    try {
      const res = await api.get('/admin/helplines');
      if (res.data.success) {
        setHelplines(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHelplines();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditing(item);
      setName(item.name);
      setNumber(item.number);
      setCategory(item.category);
      setDescription(item.description);
      setState(item.state || 'National');
      setIsNational(item.isNational);
    } else {
      setEditing(null);
      setName('');
      setNumber('');
      setCategory('Women Safety');
      setDescription('');
      setState('National');
      setIsNational(true);
    }
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/helplines', {
        id: editing?._id,
        name,
        number,
        category,
        description,
        state,
        isNational,
      });

      setMessage('Helpline saved successfully.');
      setModalOpen(false);
      fetchHelplines();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to save helpline.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this helpline?')) return;
    try {
      await api.delete(`/admin/helplines/${id}`);
      setMessage('Helpline deleted.');
      fetchHelplines();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-purple-700" />
            Emergency Helpline Directory Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure pan-India and regional emergency response telephone lines.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Helpline
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {helplines.map((h) => (
          <div
            key={h._id}
            className="p-6 rounded-3xl bg-white border border-slate-100 shadow-soft-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  {h.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">{h.state || 'National'}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{h.name}</h3>
              <p className="text-xl font-black text-purple-900 font-mono mb-2">{h.number}</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{h.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenModal(h)}
                className="p-2 text-slate-400 hover:text-purple-700 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(h._id)}
                className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {editing ? 'Edit Helpline' : 'New Emergency Helpline'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service / Agency Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Women in Distress Special Cell"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number / Shortcode</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="e.g. 1091 or 112"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Women Safety">Women Safety</option>
                    <option value="Police">Police</option>
                    <option value="Medical">Medical</option>
                    <option value="Child">Child</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Legal Aid">Legal Aid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / Region</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="National / Delhi"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Operating hours, jurisdiction, services provided..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
                >
                  Save Helpline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHelplinesPage;
