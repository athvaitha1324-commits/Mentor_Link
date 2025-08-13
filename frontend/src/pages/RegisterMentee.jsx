import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function RegisterMentee() {
  const { register, handleSubmit } = useForm();
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/mentors').then(r => setMentors(r.data));
  }, []);

  async function onSubmit(data) {
    const res = await api.post('/auth/register/mentee', data);
    if (res.data) navigate('/login');
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Mentee Registration</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
          <input className="input col-span-2" placeholder="Name" {...register('name')} />
          <input className="input col-span-2" placeholder="Email" {...register('email')} />
          <input className="input col-span-2" type="password" placeholder="Password" {...register('password')} />
          <input className="input" placeholder="Department (e.g., CSE)" {...register('department')} />
          <select className="input" {...register('year')}>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>
          <select className="input col-span-2" {...register('mentorIdString')}>
            <option value="">Select Mentor</option>
            {mentors.map(m => (
              <option key={m._id} value={m.mentorIdString}>{m.name} ({m.mentorIdString})</option>
            ))}
          </select>
          <input className="input col-span-2" placeholder="Batch/Grad Year (e.g., 2025)" {...register('gradYearOrBatch')} />
          <button className="btn-primary col-span-2" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}