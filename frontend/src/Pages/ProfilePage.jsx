import React, { useState } from 'react';
import { Camera, Save, Plus, Trash2, MapPin, Phone, Mail, User, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProfilePage = () => {
    const { accentColor, themeClasses, addToast } = useApp();
    const { user, updateProfile } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
    });
    const [addresses, setAddresses] = useState(user?.savedAddresses || []);
    const [newAddr, setNewAddr] = useState('');
    const [newAddrLabel, setNewAddrLabel] = useState('');
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        updateProfile({ ...form, avatar: avatarPreview, savedAddresses: addresses });
        setSaving(false);
        addToast('Profile updated!', 'success');
    };

    const addAddress = () => {
        if (!newAddr.trim()) return;
        const addr = { id: Date.now(), label: newAddrLabel || 'Address', address: newAddr.trim() };
        setAddresses(a => [...a, addr]);
        setNewAddr('');
        setNewAddrLabel('');
    };

    const removeAddress = (id) => setAddresses(a => a.filter(ad => ad.id !== id));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

                {/* Avatar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-5">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <img
                                src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random&size=96`}
                                alt={form.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700"
                            />
                            <label className="absolute bottom-0 right-0 cursor-pointer w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                                <Camera size={13} className="text-white" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </label>
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{form.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-xs font-semibold ${themeClasses.text[accentColor]} ${themeClasses.lightBg[accentColor]} px-2 py-0.5 rounded-full capitalize`}>{user?.role}</span>
                                {user?.role === 'provider' && (
                                    <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                        <Shield size={10} fill="currentColor" /> Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile fields */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-5 space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                    <Input
                        label="Full Name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Alex Johnson"
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                    />
                    <Input
                        label="Phone"
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                    />
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Bio</label>
                        <textarea
                            rows={3}
                            value={form.bio}
                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                            placeholder="A little about yourself..."
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />
                    </div>
                </div>

                {/* Saved addresses */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6 space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Saved Addresses</h3>
                    {addresses.map(addr => (
                        <div key={addr.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                            <MapPin size={16} className={themeClasses.text[accentColor]} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{addr.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{addr.address}</p>
                            </div>
                            <button onClick={() => removeAddress(addr.id)} className="p-1 text-gray-400 hover:text-red-500">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Label (e.g. Home)"
                            value={newAddrLabel}
                            onChange={e => setNewAddrLabel(e.target.value)}
                            className="w-28"
                        />
                        <Input
                            placeholder="Full address"
                            value={newAddr}
                            onChange={e => setNewAddr(e.target.value)}
                            className="flex-1"
                        />
                        <Button size="sm" variant="secondary" onClick={addAddress} disabled={!newAddr.trim()}>
                            <Plus size={14} />
                        </Button>
                    </div>
                </div>

                <Button loading={saving} className="w-full !py-3" onClick={handleSave}>
                    <Save size={16} /> Save Profile
                </Button>
            </div>
        </div>
    );
};

export default ProfilePage;
