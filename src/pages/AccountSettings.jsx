import { useState } from 'react';
import { MapPin, Lock, X, Check } from 'lucide-react';

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
  });
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState('');
  const [mapQuery, setMapQuery] = useState('restaurant near me');
  const [savedMessage, setSavedMessage] = useState('');

  // Load saved profile from localStorage
  useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tastybites_profile') || '{}');
      if (saved.Name) setFormData((prev) => ({ ...prev, Name: saved.Name }));
      if (saved.Email) setFormData((prev) => ({ ...prev, Email: saved.Email }));
      if (saved.Phone) setFormData((prev) => ({ ...prev, Phone: saved.Phone || '' }));
      if (saved.Location) setDeliveryLocation(saved.Location);
    } catch {
      // ignore
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (savedUser.Name && !formData.Name) {
        setFormData((prev) => ({
          ...prev,
          Name: savedUser.Name || '',
          Email: savedUser.Email || '',
        }));
      }
    } catch {
      // ignore
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('tastybites_profile') || '{}');
      localStorage.setItem(
        'tastybites_profile',
        JSON.stringify({ ...existing, ...formData, Location: deliveryLocation })
      );
    } catch {
      // ignore
    }
    setSavedMessage('Profile updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleOpenMap = () => {
    setTempLocation(deliveryLocation);
    setMapQuery(deliveryLocation || 'restaurant near me');
    setMapModalOpen(true);
  };

  const handleConfirmLocation = () => {
    setDeliveryLocation(tempLocation || mapQuery);
    setMapModalOpen(false);
  };

  const handleCancelLocation = () => {
    setMapModalOpen(false);
    setTempLocation('');
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-100">Account Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your profile and delivery preferences</p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 p-3 rounded-lg mb-6 text-sm backdrop-blur-md">
          {savedMessage}
        </div>
      )}

      {/* Profile Details Form */}
      <form onSubmit={handleSaveProfile} className="glass-panel p-6 space-y-5">
        <h2 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-3">
          Profile Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input
            type="text"
            name="Name"
            required
            value={formData.Name}
            onChange={handleChange}
            className="glass-input w-full px-4 py-2.5"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <input
            type="email"
            name="Email"
            required
            value={formData.Email}
            onChange={handleChange}
            className="glass-input w-full px-4 py-2.5"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
          <input
            type="tel"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            className="glass-input w-full px-4 py-2.5"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Password - locked / read-only */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div className="relative">
            <input
              type="text"
              value="********"
              disabled
              className="glass-input w-full px-4 py-2.5 pr-10 cursor-not-allowed opacity-60"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Password cannot be edited here. Please use the forgot password flow to reset.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="btn-primary px-6 py-2.5 text-sm">
            Save Changes
          </button>
        </div>
      </form>

      {/* Delivery Location */}
      <div className="glass-panel p-6 mt-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-100 border-b border-white/10 pb-3">
          Delivery Location
        </h2>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-300 mb-1">Current Address</p>
            {deliveryLocation ? (
              <p className="text-slate-300 text-sm bg-slate-800/40 border border-white/10 rounded-lg p-3">
                {deliveryLocation}
              </p>
            ) : (
              <p className="text-slate-500 text-sm bg-slate-800/30 border border-dashed border-white/10 rounded-lg p-3 italic">
                No delivery location set. Click below to add one.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleOpenMap} className="btn-primary px-5 py-2.5 text-sm">
            {deliveryLocation ? 'Change Location' : 'Add Location'}
          </button>
        </div>
      </div>

      {/* Google Maps Location Picker Modal */}
      {mapModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={handleCancelLocation}
          />

          {/* Modal */}
          <div className="relative glass-panel w-full max-w-2xl p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Pick Your Location
              </h2>
              <button
                onClick={handleCancelLocation}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-4">
              Search for your area or drag the map to pin your delivery address. Then enter the address below and confirm.
            </p>

            {/* Search bar for map */}
            <input
              type="text"
              value={mapQuery}
              onChange={(e) => setMapQuery(e.target.value)}
              className="glass-input w-full px-4 py-2.5 mb-4 text-sm"
              placeholder="Search for your area..."
            />

            {/* Google Maps iframe */}
            <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
              <iframe
                title="Google Maps Location Picker"
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery || 'restaurant near me')}&output=embed`}
              />
            </div>

            {/* Address confirmation input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Delivery Address
              </label>
              <input
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="glass-input w-full px-4 py-2.5 text-sm"
                placeholder="Enter your full delivery address..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={handleCancelLocation} className="btn-secondary px-5 py-2.5 text-sm">
                Cancel
              </button>
              <button
                onClick={handleConfirmLocation}
                className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
