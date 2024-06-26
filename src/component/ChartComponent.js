import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartComponent = ({
  timeframe,
  handleTimeframeChange,
  exportChart,
  filteredData,
  formatXAxis,
  chartRef,
}) => {
  return (
    <div className="App main-container p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        React Charting Library
      </h1>
      <div className="flex justify-center items-center mb-4 space-x-4">
        <label htmlFor="timeframe" className="text-lg text-gray-700">
          Timeframe:{" "}
        </label>
        <select
          id="timeframe"
          value={timeframe}
          onChange={handleTimeframeChange}
          className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          onClick={exportChart}
          className="py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Export Chart
        </button>
      </div>
      <div ref={chartRef} className="bg-white shadow rounded-lg p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tickItem) => formatXAxis(tickItem, timeframe)}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
