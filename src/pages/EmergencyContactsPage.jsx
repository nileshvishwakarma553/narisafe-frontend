import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Heart,
  Trash2,
  Edit2,
  CheckCircle,
  Star,
  Send,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

const EmergencyContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states for contact
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  // Form state for inviting guardian
  const [guardianIdentifier, setGuardianIdentifier] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Guardian');

  const fetchContactsAndGuardians = async () => {
    setLoading(true);
    try {
      const [cRes, gRes] = await Promise.all([
        api.get('/contacts'),
        api.get('/guardian/connections'),
      ]);

      if (cRes.data.success) setContacts(cRes.data.data);
      if (gRes.data.success) setGuardians(gRes.data.guardians || []);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactsAndGuardians();
  }, []);

  const handleOpenAddModal = (contact = null) => {
    setError('');
    if (contact) {
      setEditingContact(contact);
      setName(contact.name);
      setPhone(contact.phone);
      setRelationship(contact.relationship);
      setEmail(contact.email || '');
      setIsPrimary(contact.isPrimary || false);
    } else {
      setEditingContact(null);
      setName('');
      setPhone('');
      setRelationship('Family Member');
      setEmail('');
      setIsPrimary(contacts.length === 0);
    }
    setModalOpen(true);
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length < 8) {
      setError('Please provide a valid phone number with country/area code.');
      return;
    }

    try {
      if (editingContact) {
        await api.put(`/contacts/${editingContact._id}`, {
          name,
          phone,
          relationship,
          email,
          isPrimary,
        });
        setSuccess('Contact updated successfully.');
      } else {
        await api.post('/contacts', {
          name,
          phone,
          relationship,
          email,
          isPrimary,
        });
        setSuccess('Emergency contact added successfully.');
      }

      setModalOpen(false);
      fetchContactsAndGuardians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact.');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to remove this emergency contact?')) return;

    try {
      await api.delete(`/contacts/${id}`);
      setSuccess('Contact removed.');
      fetchContactsAndGuardians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact.');
    }
  };

  const handleInviteGuardian = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/guardian/invite', {
        guardianEmailOrPhone: guardianIdentifier,
        relationshipTag: guardianRelation,
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        setInviteModalOpen(false);
        setGuardianIdentifier('');
        fetchContactsAndGuardians();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send guardian invitation.');
    }
  };

  const handleRevokeGuardian = async (connectionId) => {
    if (!window.confirm('Revoke monitoring access for this guardian?')) return;

    try {
      await api.delete(`/guardian/connections/${connectionId}`);
      setSuccess('Guardian access revoked.');
      fetchContactsAndGuardians();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to revoke guardian.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-700" />
            Emergency Contacts & Guardian Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal lifeline. These contacts receive immediate SOS notifications and live coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Invite App Guardian
          </button>
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Emergency Contact
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Emergency Contacts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Direct Emergency Contacts ({contacts.length})
          </h2>
          <span className="text-xs text-slate-500">Accessible for 1-Tap Calling & SMS</span>
        </div>

        {contacts.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-slate-100 shadow-soft-sm text-center">
            <Heart className="w-10 h-10 mx-auto text-purple-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No emergency contacts configured yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Add at least one trusted primary contact who can be reached immediately during emergencies.
            </p>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs"
            >
              Add First Contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className={`p-6 rounded-3xl bg-white border transition-all duration-200 shadow-soft-sm flex flex-col justify-between ${
                  contact.isPrimary ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {contact.relationship}
                    </span>
                    {contact.isPrimary && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Primary
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{contact.name}</h3>
                  <p className="text-xs text-slate-600 font-mono mb-1">{contact.phone}</p>
                  {contact.email && <p className="text-[11px] text-slate-400">{contact.email}</p>}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition flex items-center gap-1.5"
                      title="Direct Call"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={`sms:${contact.phone}?body=EMERGENCY: I need assistance. Please check on me.`}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                      title="Send SMS"
                    >
                      <Send className="w-3.5 h-3.5" /> SMS
                    </a>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenAddModal(contact)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connected NariSafe App Guardians */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-sm border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-700" />
              Connected App Guardians ({guardians.length})
            </h2>
            <p className="text-xs text-slate-500">
              Users registered on NariSafe who have live dashboard monitoring access to your emergency alerts
            </p>
          </div>
          <button
            onClick={() => setInviteModalOpen(true)}
            className="text-xs font-bold text-indigo-700 hover:underline"
          >
            + Invite Another Guardian
          </button>
        </div>

        {guardians.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No registered guardians linked yet. Invite a family member who has a NariSafe account.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {guardians.map((conn) => (
              <div key={conn._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center">
                    {conn.guardianId?.name ? conn.guardianId.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{conn.guardianId?.name || 'Guardian'}</h4>
                    <p className="text-xs text-slate-500">{conn.guardianId?.email || conn.guardianId?.phone}</p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Relationship: {conn.relationshipTag || 'Guardian'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      conn.invitationStatus === 'accepted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {conn.invitationStatus === 'accepted' ? 'Authorized Guardian' : 'Pending Acceptance'}
                  </span>
                  <button
                    onClick={() => handleRevokeGuardian(conn._id)}
                    className="text-xs font-semibold text-red-600 hover:underline px-2 py-1"
                  >
                    Revoke Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              This contact will be called and sent location breadcrumbs during SOS.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Friend">Close Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 text-purple-700 rounded border-slate-300 focus:ring-purple-600"
                />
                <label htmlFor="primaryCheck" className="text-xs font-semibold text-slate-700">
                  Set as Primary Contact (Top Priority SOS Dial)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite App Guardian Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Invite NariSafe Guardian</h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter the registered email or phone number of your guardian.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleInviteGuardian} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guardian Email or Phone
                </label>
                <input
                  type="text"
                  required
                  value={guardianIdentifier}
                  onChange={(e) => setGuardianIdentifier(e.target.value)}
                  placeholder="rajesh@narisafe.org or +91 98765 22222"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Relationship Tag
                </label>
                <input
                  type="text"
                  value={guardianRelation}
                  onChange={(e) => setGuardianRelation(e.target.value)}
                  placeholder="e.g. Father, Elder Sister, Trusted Friend"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsPage;
