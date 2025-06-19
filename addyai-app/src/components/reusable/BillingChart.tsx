import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Rectangle,
  BarChart,
} from 'recharts';
import { USERID } from '../../utils/constants';

export default function BillingChart() {
  const [chartData, setChartData] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const userId = localStorage.getItem(USERID);
    const fetchUsageData = async () => {
      try {
        const response = await fetch(`${baseUrl}/usage/aggregate?userId=${userId}`);
        const data = await response.json();

        // Transform API data into chart format
        const formatted = data.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString(),
          tokens: item.totalInputTokens + item.totalOutputTokens,
          cost: parseFloat(item.totalCost.toFixed(4)), // adjust precision if needed
        }));

        setChartData(formatted);
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      }
    };

    fetchUsageData();
  }, [baseUrl]); // Added baseUrl to dependencies

  return (
    <div className="w-full h-[300px] text-zinc-200">
      {' '}
      {/* Added text-zinc-200 for default color */}
      <h3 className="mb-4 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-amber-400">
        Usage Statistics
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" /> {/* Darker grid lines */}
          <XAxis dataKey="name" stroke="#a0a0a0" /> {/* Lighter axis labels */}
          <YAxis stroke="#a0a0a0" /> {/* Lighter axis labels */}
          <Tooltip
            contentStyle={{
              backgroundColor: '#2d2d2d',
              border: '1px solid #4a4a4a',
              borderRadius: '8px',
              color: '#ffffff',
            }} // Darker tooltip
            labelStyle={{ color: '#a0a0a0' }} // Lighter label
            itemStyle={{ color: '#ffffff' }} // Lighter item text
          />
          <Legend wrapperStyle={{ color: '#a0a0a0' }} /> {/* Lighter legend */}
          <Bar
            dataKey="tokens"
            fill="#4ade80" // Green accent color for tokens
            activeBar={<Rectangle fill="#facc15" stroke="#4ade80" />} // Amber accent on active bar
          />
          <Bar dataKey="cost" fill="#facc15" /> {/* Amber accent color for cost */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
