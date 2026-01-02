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
  { month: "Jan", Work: 12000, Overtime: 9000 },
  { month: "Feb", Work: 15000, Overtime: 11000 },
  { month: "Mar", Work: 18000, Overtime: 14000 },
  { month: "Apr", Work: 20000, Overtime: 16000 },
  { month: "May", Work: 22000, Overtime: 19000 },
  { month: "Jun", Work: 25000, Overtime: 21000 },
  { month: "Jul", Work: 28000, Overtime: 24000 },
  { month: "Aug", Work: 30000, Overtime: 26000 },
  { month: "Sep", Work: 32000, Overtime: 29000 },
  { month: "Oct", Work: 35000, Overtime: 31000 },
  { month: "Nov", Work: 38000, Overtime: 34000 },
  { month: "Dec", Work: 42000, Overtime: 39000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const uniquePayload = payload.filter(
      (item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.dataKey === item.dataKey)
    );

    const dotColors: Record<string, string> = {
      Work: "#0755E9",
      Overtime: "#14CCC2",
    };

    return (
      <div className="p-3 bg-white border border-gray-200 shadow-xl rounded-xl">
        <p className="mb-1 text-sm font-semibold">{label}</p>

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
    <div className="w-full h-81.5">
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
            dataKey="Work"
            stroke="none"
            fill="rgba(34, 197, 94, 0.2)"
          />
          <Area
            type="monotone"
            dataKey="Overtime"
            stroke="none"
            fill="rgba(59, 130, 246, 0.2)"
          />
          <Line
            type="monotone"
            dataKey="Work"
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
            dataKey="Overtime"
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
