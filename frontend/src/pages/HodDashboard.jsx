import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { api } from '../lib/api';
import AnalyticsCharts from '../components/AnalyticsCharts.jsx';

export default function HodDashboard() {
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [progress, setProgress] = useState({});

  async function loadTeams() {
    const q = new URLSearchParams();
    if (department) q.set('department', department);
    if (year) q.set('year', year);
    const res = await api.get(`/hod/teams?${q.toString()}`);
    setTeams(res.data);
  }

  async function loadProgress(teamIdString) {
    const res = await api.get(`/reports/progress?teamIdString=${encodeURIComponent(teamIdString)}`);
    setProgress(res.data);
  }

  useEffect(() => { loadTeams(); }, [department, year]);
  useEffect(() => { if (selectedTeam) loadProgress(selectedTeam); }, [selectedTeam]);

  function exportCsv() {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/export?type=csv&scope=team&teamIdString=${encodeURIComponent(selectedTeam)}`, '_blank');
  }
  function exportPdf() {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/export?type=pdf&scope=team&teamIdString=${encodeURIComponent(selectedTeam)}`, '_blank');
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h3 className="font-semibold">Filters</h3>
          <input className="input" placeholder="Department (e.g., CSE)" value={department} onChange={e=>setDepartment(e.target.value)} />
          <select className="input" value={year} onChange={e=>setYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>
          <button className="btn-primary w-full" onClick={loadTeams}>Search</button>
        </div>
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {teams.map(t => (
                <button key={t.teamIdString} onClick={()=>setSelectedTeam(t.teamIdString)} className={`border p-3 rounded text-left ${selectedTeam===t.teamIdString?'border-blue-500':''}`}>
                  <div className="font-medium">{t.teamIdString}</div>
                  <div className="text-sm text-gray-600">Mentor: {t.mentorIdString}</div>
                  <div className="text-sm">Mentees: {t.mentees.length}</div>
                </button>
              ))}
            </div>
          </div>
          {selectedTeam && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={exportCsv}>Export CSV</button>
                <button className="btn-secondary" onClick={exportPdf}>Export PDF</button>
              </div>
              <AnalyticsCharts progress={progress} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}