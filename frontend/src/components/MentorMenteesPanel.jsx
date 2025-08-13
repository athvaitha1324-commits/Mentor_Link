import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../store/auth';

export default function MentorMenteesPanel({ mentees, onSaved }) {
  const { user } = useAuth();
  const [savingId, setSavingId] = useState(null);

  async function saveNote(menteeId, note) {
    setSavingId(menteeId);
    await api.post(`/mentors/mentees/${menteeId}/notes`, { note });
    setSavingId(null);
    onSaved?.();
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">My Mentees</h2>
      <ul className="space-y-3 max-h-96 overflow-auto">
        {mentees.map(m => {
          const note = m.notes?.[user?._id] || '';
          return (
            <li key={m._id} className="text-sm">
              <div className="font-medium">{m.name} - {m.menteeIdString}</div>
              <div className="mt-1 flex gap-2">
                <input defaultValue={note} className="input" placeholder="Private note" onBlur={e => saveNote(m._id, e.target.value)} />
                <button className="btn-secondary" onClick={(e) => saveNote(m._id, e.currentTarget.previousSibling.value)} disabled={savingId===m._id}>{savingId===m._id?'Saving...':'Save'}</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}