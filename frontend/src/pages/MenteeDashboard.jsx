import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { api } from '../lib/api';
import ProofUploader from '../components/ProofUploader.jsx';

export default function MenteeDashboard() {
  const [tasks, setTasks] = useState([]);

  async function load() {
    const ts = await api.get('/mentees/tasks');
    setTasks(ts.data);
  }

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-4">
        {tasks.map(t => (
          <div key={t._id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : '-'}</div>
                {t.attachment?.driveLink && <a className="text-blue-600 text-sm" href={t.attachment.driveLink} target="_blank">Task PDF</a>}
                {t.meetingLink && <div className="text-sm">Meeting: <a className="text-blue-600" href={t.meetingLink} target="_blank">{t.meetingLink}</a></div>}
              </div>
            </div>
            <div className="mt-3">
              <ProofUploader taskId={t._id} onUploaded={load} />
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}