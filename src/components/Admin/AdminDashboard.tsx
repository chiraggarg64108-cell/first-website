import React, { useState } from 'react';
import { useRide } from '../../context/RideContext';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Check, 
  X, 
  AlertTriangle, 
  FileCheck, 
  Activity, 
  Settings, 
  Percent, 
  Sliders,
  Car
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    driversList,
    usersList,
    fareConfig,
    updateFareConfig,
    verifyDriverDoc,
    toggleUserSuspension,
    currentTrip
  } = useRide();

  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'fares'>('verification');
  
  // Local state for fare slider edits
  const [baseFare, setBaseFare] = useState(fareConfig.baseFare);
  const [perMile, setPerMile] = useState(fareConfig.perMileRate);
  const [perMinute, setPerMinute] = useState(fareConfig.perMinuteRate);
  const [commission, setCommission] = useState(fareConfig.platformCommissionPercent);
  const [surge, setSurge] = useState(fareConfig.surgeMultiplier);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveFares = () => {
    updateFareConfig({
      baseFare,
      perMileRate: perMile,
      perMinuteRate: perMinute,
      platformCommissionPercent: commission,
      surgeMultiplier: surge
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Admin Top Metrics & Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Driver Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab('fares')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'fares'
                ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Fare Configuration</span>
          </button>
        </div>

        {/* Live Admin Quick Ticker */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Fleet Online:</span>
            <span className="font-mono text-white font-bold">{driversList.filter(d => d.isOnline).length} / {driversList.length}</span>
          </div>
          <div className="text-neutral-600">|</div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span>Commission:</span>
            <span className="font-mono text-yellow-400 font-bold">{fareConfig.platformCommissionPercent}%</span>
          </div>
        </div>
      </div>

      {/* 1. DRIVER VERIFICATION QUEUE (PRD P0) */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Driver Document Compliance & Verification Desk
                </h3>
                <p className="text-xs text-neutral-400">
                  Review submitted Driver Licenses, Vehicle Registrations, and Insurance policies before dispatch authorization.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {driversList.map(driver => (
                <div
                  key={driver.id}
                  className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-10 h-10 rounded-full object-cover border border-yellow-400"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{driver.name}</h4>
                        <p className="text-[11px] text-neutral-400">
                          {driver.vehicle.model} · <span className="font-mono text-yellow-400">{driver.vehicle.plate}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block font-mono">Driver ID: {driver.id}</span>
                      <span className="text-xs text-yellow-400 font-bold">★ {driver.rating}</span>
                    </div>
                  </div>

                  {/* Documents Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {(['license', 'registration', 'insurance'] as const).map(docType => {
                      const doc = driver.documents[docType];
                      return (
                        <div
                          key={docType}
                          className="p-3 bg-neutral-900 rounded-xl border border-neutral-800/80 flex flex-col justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase text-neutral-300">
                                {docType}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                doc.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                doc.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-mono block mt-1">
                              Submitted: {doc.submittedDate}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              onClick={() => verifyDriverDoc(driver.id, docType, 'approved')}
                              className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors border border-emerald-500/30"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => verifyDriverDoc(driver.id, docType, 'rejected')}
                              className="flex-1 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors border border-red-500/30"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. USER MANAGEMENT TABLE (PRD P1) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Platform Account Management & Trust Directory
              </h3>
              <p className="text-xs text-neutral-400">
                Monitor platform riders and taxi drivers. Suspend accounts in case of safety reports or disputes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-medium uppercase text-[10px]">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Total Rides</th>
                    <th className="py-2.5 px-3">Rating</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-950/40 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white font-sans">{u.name}</span>
                        <span className="text-[10px] text-neutral-500 block">{u.email}</span>
                      </td>
                      <td className="py-3 px-3 uppercase text-[11px] font-bold">
                        <span className={u.role === 'driver' ? 'text-yellow-400' : 'text-blue-400'}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-300">{u.phone}</td>
                      <td className="py-3 px-3 text-neutral-200">{u.tripsCount}</td>
                      <td className="py-3 px-3 text-yellow-400">★ {u.rating}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.isSuspended ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {u.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-sans">
                        <button
                          onClick={() => toggleUserSuspension(u.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                          }`}
                        >
                          {u.isSuspended ? 'Reinstate' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. FARE CONFIGURATION (PRD P2: Adjust base fare, per-mile rate, per-minute rate, and platform commission) */}
      {activeTab === 'fares' && (
        <div className="space-y-4">
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Dynamic Fare Matrix & Commission Controls
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Adjusting these rates instantly updates upfront calculations across all rider and driver interfaces.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Base Fare */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-300">Base Fare ($)</span>
                  <span className="font-mono font-bold text-yellow-400 text-sm">${baseFare.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.25"
                  value={baseFare}
                  onChange={e => setBaseFare(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block">Initial charge when rider steps in</span>
              </div>

              {/* Per-Mile Rate */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-300">Per-Mile Rate ($/mi)</span>
                  <span className="font-mono font-bold text-yellow-400 text-sm">${perMile.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.80"
                  max="5.0"
                  step="0.05"
                  value={perMile}
                  onChange={e => setPerMile(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block">Distance travel fee</span>
              </div>

              {/* Per-Minute Rate */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-300">Per-Minute Rate ($/min)</span>
                  <span className="font-mono font-bold text-yellow-400 text-sm">${perMinute.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.50"
                  step="0.05"
                  value={perMinute}
                  onChange={e => setPerMinute(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block">Time and traffic waiting fee</span>
              </div>

              {/* Platform Commission */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-300">Platform Commission (%)</span>
                  <span className="font-mono font-bold text-yellow-400 text-sm">{commission}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={commission}
                  onChange={e => setCommission(parseInt(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block">RideWeb service fee per completed trip</span>
              </div>

              {/* Dynamic Surge Pricing Multiplier (Post-MVP PRD Feature) */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2 sm:col-span-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-300">Dynamic Surge Pricing Multiplier</span>
                  <span className="font-mono font-bold text-yellow-400 text-sm">{surge.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={surge}
                  onChange={e => setSurge(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400 cursor-pointer"
                />
                <span className="text-[10px] text-neutral-500 block">
                  Simulate high demand peak hours (e.g. 1.4x during evening rush hour)
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveFares}
                className="px-6 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-yellow-400/20 active:scale-95"
              >
                Save Global Fare Rules
              </button>
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                  <Check className="w-4 h-4" /> Rules deployed live to all clients!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
