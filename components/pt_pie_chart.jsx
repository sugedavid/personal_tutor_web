// BarChart.js
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const PtPieChart = ({ data }) => {
  const COLORS = ['#9F7AEA', '#4299E1', '#48BB78', '#ED8936', '#FF8042'];

  return (
    <ResponsiveContainer width='50%' height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={60}
          outerRadius={80}
          fill='#8884d8'
          label
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PtPieChart;
