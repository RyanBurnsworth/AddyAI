import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Rectangle,
  BarChart
} from "recharts";

export default function BillingChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await fetch("http://localhost:3000/usage/aggregate?userId=2");
        const data = await response.json();

        // Transform API data into chart format
        const formatted = data.map((item: any) => ({
          name: new Date(item.date).toLocaleDateString(),
          tokens: item.totalInputTokens + item.totalOutputTokens,
          cost: parseFloat(item.totalCost.toFixed(4)), // adjust precision if needed
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("Failed to fetch usage data:", error);
      }
    };

    fetchUsageData();
  }, []);

  return (
    <div className="mt-4 h-[300px]">
      <h2 className="mb-4"><strong>Usage</strong></h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="tokens"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar dataKey="cost" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
