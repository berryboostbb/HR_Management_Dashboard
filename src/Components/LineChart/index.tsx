import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

const graphData = [
  { month: "Jan", Target: 12000, Achievement: 9000 },
  { month: "Feb", Target: 15000, Achievement: 11000 },
  { month: "Mar", Target: 18000, Achievement: 14000 },
  { month: "Apr", Target: 20000, Achievement: 16000 },
  { month: "May", Target: 22000, Achievement: 19000 },
  { month: "Jun", Target: 25000, Achievement: 21000 },
  { month: "Jul", Target: 28000, Achievement: 24000 },
  { month: "Aug", Target: 30000, Achievement: 26000 },
  { month: "Sep", Target: 32000, Achievement: 29000 },
  { month: "Oct", Target: 35000, Achievement: 31000 },
  { month: "Nov", Target: 38000, Achievement: 34000 },
  { month: "Dec", Target: 42000, Achievement: 39000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const uniquePayload = payload.filter(
      (item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.dataKey === item.dataKey)
    );

    const dotColors: Record<string, string> = {
      Target: "#0755E9",
      Achievement: "#14CCC2",
    };

    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-200">
        <p className="text-sm font-semibold mb-1">{label}</p>

        {uniquePayload.map((item: any, index: number) => (
          <p key={index} className="text-xs text-[#7d7d7d]">
            <span
              className="inline-block w-2 h-2 mr-1 rounded-full"
              style={{ backgroundColor: dotColors[item.dataKey] }}
            ></span>
            {item.name}: {item.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default function LineChart() {
  return (
    <div className="w-full h-88.5">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart
          data={graphData}
          margin={{ top: 7, right: 0, left: 0, bottom: -3 }}
        >
          <CartesianGrid vertical={false} horizontal={false} />

          <XAxis
            style={{ fontSize: "14px" }}
            dataKey="month"
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            style={{ fontSize: "14px" }}
            tickFormatter={(val: number) =>
              val === 0 ? "0" : `${Math.round(val / 1000)}k`
            }
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="Target"
            stroke="none"
            fill="rgba(34, 197, 94, 0.2)"
          />
          <Area
            type="monotone"
            dataKey="Achievement"
            stroke="none"
            fill="rgba(59, 130, 246, 0.2)"
          />
          <Line
            type="monotone"
            dataKey="Target"
            stroke="#0755E9"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={{
              r: 4,
              fill: "#0755E9",
              stroke: "#0755E9",
              strokeWidth: 0,
            }}
          />
          <Line
            type="monotone"
            dataKey="Achievement"
            stroke="#14CCC2"
            strokeWidth={1}
            dot={{
              r: 4,
              fill: "#14CCC2",
              stroke: "#14CCC2",
              strokeWidth: 0,
            }}
          />
        </ReLineChart>
      </ResponsiveContainer>

      <style>
        {`
          svg:focus {
            outline: none;
          }
        `}
      </style>
    </div>
  );
}
