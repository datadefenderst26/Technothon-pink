import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartWidgetProps {
  type: 'bar' | 'line' | 'pie';
  data: Record<string, unknown>[];
  title?: string;
  className?: string;
}

const CHART_COLORS = [
  'hsl(245, 58%, 51%)',
  'hsl(192, 91%, 50%)',
  'hsl(160, 84%, 45%)',
  'hsl(38, 92%, 55%)',
  'hsl(330, 70%, 55%)',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel rounded-lg px-3 py-2 border border-border/50">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  type,
  data,
  title,
  className,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={cn('glass-panel rounded-xl p-8 text-center', className)}>
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  const keys = Object.keys(data[0]);
  const xKey = keys[0];
  const valueKeys = keys.slice(1);

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis
              dataKey={xKey}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <YAxis
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
            />
            {valueKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis
              dataKey={xKey}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <YAxis
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
            />
            {valueKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKeys[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={{ stroke: 'hsl(215, 20%, 55%)' }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('glass-panel rounded-xl overflow-hidden', className)}>
      {title && (
        <div className="px-4 py-3 border-b border-border/50 bg-secondary/30">
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
      )}
      <div className="p-4" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
