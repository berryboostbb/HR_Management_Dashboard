import { useQuery } from "@tanstack/react-query";
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
import { getAttendanceGraph } from "../../api/attendanceServices";

const dotColors: Record<string, string> = {
  Total: "#6366F1",
  Present: "#22C55E",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  // ✅ Remove duplicates by dataKey
  const uniquePayload = payload.filter(
    (item: any, index: number, self: any[]) =>
      index === self.findIndex((t) => t.dataKey === item.dataKey)
  );

  return (
    <div className="p-3 bg-white border shadow-lg rounded-xl">
      <p className="mb-1 text-sm font-semibold">{label}</p>

      {uniquePayload.map((item: any, index: number) => (
        <p key={index} className="flex items-center text-xs text-gray-600">
          <span
            className="inline-block w-2 h-2 mr-2 rounded-full"
            style={{ backgroundColor: dotColors[item.dataKey] }}
          />
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
};

export default function LineChart() {
  const { data } = useQuery({
    queryKey: ["getAttendanceGraph"],
    queryFn: getAttendanceGraph,
    staleTime: 5 * 60 * 1000,
  });

  let Graph = data?.data?.data;
  return (
    <div className="w-full h-68 2xl:h-81.5">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={Graph}>
          <CartesianGrid vertical={false} horizontal={false} />

          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />

          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="Total"
            fill="rgba(99,102,241,0.15)"
            stroke="none"
          />
          <Area
            type="monotone"
            dataKey="Present"
            fill="rgba(34,197,94,0.2)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="Total"
            stroke="#6366F1"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 4, fill: "#6366F1" }}
          />

          <Line
            type="monotone"
            dataKey="Present"
            stroke="#22C55E"
            strokeWidth={2}
            dot={{ r: 4, fill: "#22C55E" }}
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
