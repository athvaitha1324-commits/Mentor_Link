import NavBar from '../components/NavBar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto p-4">{children}</div>
    </div>
  );
}