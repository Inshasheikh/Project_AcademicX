import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Compass, Briefcase, Building2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RoleSelection() {
  const { user, selectRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(user?.profile?.role || 'student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'student',
      title: 'Student / Candidate',
      subtitle: 'Skill diagnostics, placement roadmaps, APAAR / DigiLocker integration & verified jobs.',
      icon: GraduationCap,
      color: 'blue',
      badge: 'Job Seeker',
    },
    {
      id: 'faculty',
      title: 'Faculty / Academician',
      subtitle: 'NEP 2020 & AICTE Industrial Immersion tracking, research projects & student mentorship.',
      icon: Compass,
      color: 'emerald',
      badge: 'Academic Lead',
    },
    {
      id: 'recruiter',
      title: 'Corporate Recruiter',
      subtitle: 'Access pre-assessed talent pipelines, AI skill matching, and 1-click shortlist approvals.',
      icon: Briefcase,
      color: 'indigo',
      badge: 'Hiring Partner',
    },
    {
      id: 'admin',
      title: 'Institutional Admin',
      subtitle: 'NAAC / NIRF Criterion 5 reporting, registrar degree verification & analytics queue.',
      icon: Building2,
      color: 'purple',
      badge: 'Governance',
    },
  ];

  const handleConfirmRole = async () => {
    setLoading(true);
    setError('');

    try {
      await selectRole(selectedRole);
      navigate(`/${selectedRole}/dashboard`);
    } catch (err) {
      setError(err.message || 'Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="max-w-3xl mx-auto w-full text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-md mb-3">
          R
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Your Workspace Role
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Personalize your REDDOT dashboard according to your institutional or industry affiliation.
        </p>

        {error && (
          <div className="mt-4 max-w-md mx-auto p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {roles.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedRole(item.id)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer bg-white relative overflow-hidden ${
                  isSelected
                    ? 'border-blue-600 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.subtitle}</p>

                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-blue-100 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                    <span>Selected Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 max-w-sm mx-auto">
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirmRole}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Configuring Dashboard...</span>
              </>
            ) : (
              <>
                <span>Launch {roles.find((r) => r.id === selectedRole)?.title.split(' ')[0]} Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
