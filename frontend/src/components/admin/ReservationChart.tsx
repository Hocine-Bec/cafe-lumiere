import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface ChartData {
  label: string;
  count: number;
}

interface ReservationChartProps {
  data: ChartData[];
}

export function ReservationChart({ data }: ReservationChartProps) {
  return (
    <div className="rounded-xl bg-white border border-warm-gray-light p-6 shadow-sm">
      <h3 className="font-semibold text-charcoal mb-4">This Week's Reservations</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="copperGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B87333" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#B87333" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D8" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9C8E84' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#9C8E84' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E8E0D8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#B87333"
            strokeWidth={2}
            fill="url(#copperGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
