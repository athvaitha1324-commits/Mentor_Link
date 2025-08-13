import { useForm } from 'react-hook-form';
import { api } from '../lib/api';
import { useAuth } from '../store/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function onSubmit(data) {
    try {
      const res = await api.post('/auth/login', data);
      setSession(res.data);
      const role = res.data.user.role;
      if (role === 'mentor') navigate('/dashboard/mentor');
      else if (role === 'mentee') navigate('/dashboard/mentee');
      else navigate('/dashboard/hod');
    } catch (e) {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input className="input" placeholder="Email" {...register('email')} />
          <input className="input" type="password" placeholder="Password" {...register('password')} />
          <button className="btn-primary w-full" type="submit">Login</button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Register as <Link to="/register/mentor" className="text-blue-600">Mentor</Link>,{' '}
          <Link to="/register/mentee" className="text-blue-600">Mentee</Link>, or{' '}
          <Link to="/register/hod" className="text-blue-600">HOD</Link>
        </div>
      </div>
    </div>
  );
}