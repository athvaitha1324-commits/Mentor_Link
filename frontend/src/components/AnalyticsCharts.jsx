import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AnalyticsCharts({ progress }) {
  const barData = {
    labels: ['Total Tasks', 'Completed Tasks', 'Proofs'],
    datasets: [{ label: 'Counts', data: [progress.totalTasks || 0, progress.completedTasks || 0, progress.proofsCount || 0], backgroundColor: '#3b82f6' }],
  };
  const pieData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{ data: [progress.completedTasks || 0, (progress.totalTasks || 0) - (progress.completedTasks || 0)], backgroundColor: ['#10b981', '#ef4444'] }],
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <Bar data={barData} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <Pie data={pieData} />
      </div>
    </div>
  );
}