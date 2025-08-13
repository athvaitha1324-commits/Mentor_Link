import { useForm } from 'react-hook-form';
import { api } from '../lib/api';

export default function TaskAssignForm({ mentees, onCreated }) {
  const { register, handleSubmit, reset } = useForm();

  async function onSubmit(data) {
    const menteeIds = mentees.filter(m => data[`m_${m._id}`]).map(m => m._id);
    const res = await api.post('/mentors/assign-task', {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      menteeIds,
      teamIdString: data.teamIdString || undefined,
    });

    if (data.attachment?.[0]) {
      const form = new FormData();
      form.append('file', data.attachment[0]);
      await api.post(`/tasks/${res.data._id}/attachment`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    reset();
    onCreated?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 bg-white p-4 rounded shadow">
      <h3 className="font-semibold">Assign Task</h3>
      <input className="input" placeholder="Title" {...register('title')} />
      <textarea className="input" placeholder="Description" {...register('description')} />
      <input className="input" type="date" {...register('deadline')} />
      <input className="input" placeholder="Team ID (optional)" {...register('teamIdString')} />
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto border p-2 rounded">
        {mentees.map(m => (
          <label key={m._id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register(`m_${m._id}`)} />
            {m.name} ({m.menteeIdString})
          </label>
        ))}
      </div>
      <input className="input" type="file" accept="application/pdf" {...register('attachment')} />
      <button className="btn-primary" type="submit">Create Task</button>
    </form>
  );
}