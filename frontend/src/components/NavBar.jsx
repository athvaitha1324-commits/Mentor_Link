import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

export default function NavBar() {
  const { user, clear } = useAuth();
  return (
    <div className="w-full bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
      <div className="font-semibold">Mentor-Mentee</div>
      <div className="flex items-center gap-4">
        {user?.role === 'mentor' && <Link className="hover:underline" to="/dashboard/mentor">Mentor</Link>}
        {user?.role === 'mentee' && <Link className="hover:underline" to="/dashboard/mentee">Mentee</Link>}
        {user?.role === 'hod' && <Link className="hover:underline" to="/dashboard/hod">HOD</Link>}
        <button className="bg-red-500 px-3 py-1 rounded" onClick={clear}>Logout</button>
      </div>
    </div>
  );
}