import { useForm } from 'react-hook-form';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RegisterMentor() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [hods, setHods] = useState([]);

  useEffect(() => {
    api.get('/auth/hods').then(r => setHods(r.data));
  }, []);

  async function onSubmit(data) {
    const res = await api.post('/auth/register/mentor', data);
    if (res.data) navigate('/login');
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Mentor Registration</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
          <input className="input col-span-2" placeholder="Name" {...register('name')} />
          <input className="input col-span-2" placeholder="Email" {...register('email')} />
          <input className="input col-span-2" type="password" placeholder="Password" {...register('password')} />
          <input className="input" placeholder="Department (e.g., CSE)" {...register('department')} />
          <input className="input" placeholder="Designation" {...register('designation')} />
          <select className="input col-span-2" {...register('hodId')}>
            <option value="">Select HOD (optional)</option>
            {hods.map(h => (
              <option key={h._id} value={h._id}>{h.name} - {h.department}</option>
            ))}
          </select>
          <button className="btn-primary col-span-2" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}