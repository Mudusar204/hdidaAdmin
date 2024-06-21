"use client";
import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  YAxis,
  XAxis,
} from "recharts";

// Example Data (Consider replacing or expanding as necessary)
const mainChartData = [
  { name: "Page A", uv: 4000, amt: 2400 },
  { name: "Page B", uv: 3000, amt: 2210 },
  { name: "Page C", uv: 2000, amt: 2290 },
  { name: "Page D", uv: 2780, amt: 2000 },
  { name: "Page E", uv: 1890, amt: 2181 },
  { name: "Page F", uv: 2390, amt: 2500 },
  { name: "Page G", uv: 3490, amt: 2100 },
];

const pieChartData = [
  { name: "Group A", value: 400, color: "bg-blue-500" },
  { name: "Group B", value: 300, color: "bg-red-500" },
  { name: "Group C", value: 300, color: "bg-yellow-500" },
  { name: "Group D", value: 200, color: "bg-green-500" },
];
const lineChartData = [
  { value: 10 },
  { value: 15 },
  { value: 10 },
  { value: 17 },
  { value: 18 },
];

// Simplified Widget Component Placeholder (Replace with your implementation)
const Widget = ({ title, children }) => (
  <div className="border rounded-lg p-4">
    <h4 className="font-bold mb-2">{title}</h4>
    {children}
  </div>
);

export default function Dashboard() {
  const [mainChartState, setMainChartState] = useState("monthly");

  return (
    <div className="p-4 w-full h-full overflow-y-scroll">
      <h1 className="text-2xl font-bold text-center">Dashboard</h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-start gap-3">
          {/* Visits Today Widget */}
          <Widget title="Visits Today">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">12,678</p>
              </div>
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Widget>

          {/* Revenue Breakdown Widget */}
          <Widget title="Revenue Breakdown">
            <ResponsiveContainer width={200} height={120}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={pieChartData}
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Widget>
        </div>

        {/* Main Chart Widget */}
        <Widget title="Daily Line Chart">
          <div className="flex justify-between items-center">
            <select
              className="border rounded text-sm p-1"
              value={mainChartState}
              onChange={(e) => setMainChartState(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={mainChartData}>
              <YAxis />
              <XAxis dataKey="name" />
              <Area
                type="monotone"
                dataKey="amt"
                fill="#8884d8"
                stroke="#8884d8"
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </ComposedChart>
          </ResponsiveContainer>
        </Widget>
      </div>
    </div>
  );
}
