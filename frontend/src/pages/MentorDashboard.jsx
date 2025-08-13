import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { api } from '../lib/api';
import TaskAssignForm from '../components/TaskAssignForm.jsx';
import MentorMenteesPanel from '../components/MentorMenteesPanel.jsx';
import TaskItemMentor from '../components/TaskItemMentor.jsx';

export default function MentorDashboard() {
  const [mentees, setMentees] = useState([]);
  const [tasks, setTasks] = useState([]);

  async function load() {
    const [ms, ts] = await Promise.all([
      api.get('/mentors/mentees'),
      api.get('/tasks'),
    ]);
    setMentees(ms.data);
    setTasks(ts.data);
  }

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <MentorMenteesPanel mentees={mentees} onSaved={load} />
        </div>
        <div className="md:col-span-2">
          <TaskAssignForm mentees={mentees} onCreated={load} />
          <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="font-semibold mb-2">Tasks</h3>
            <ul className="space-y-2">
              {tasks.map(t => (
                <TaskItemMentor key={t._id} task={t} onRefresh={load} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}