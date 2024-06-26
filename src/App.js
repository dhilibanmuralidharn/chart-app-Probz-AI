import "./App.css";
import { useEffect, useRef, useState } from "react";
import { parseISO, startOfWeek, startOfMonth } from "date-fns";
import html2canvas from "html2canvas";
import moment from "moment";

import ChartComponent from "./component/ChartComponent";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [timeframe, setTimeFrame] = useState("daily");
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("./data.json");
        const data = await response.json();
        console.log(data, "fetched data");

        const formattedData = data.map((item) => ({
          ...item,
          timestamp: String(item.timestamp),
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterDataByTimeframe();
  }, [timeframe, data]);

  const filterDataByTimeframe = () => {
    let filtered = [];

    if (timeframe === "daily") {
      filtered = data;
    } else if (timeframe === "weekly") {
      const weeklyMap = new Map();
      data.forEach((item) => {
        const weekstart = startOfWeek(parseISO(item.timestamp));
        const weekKey = weekstart.toISOString();
        if (!weeklyMap.has(weekKey)) {
          weeklyMap.set(weekKey, { timestamp: weekstart, value: 0, count: 0 });
        }
        const weekData = weeklyMap.get(weekKey);
        weekData.value += item.value;
        weekData.count += 1;
        weeklyMap.set(weekKey, weekData);
      });
      filtered = Array.from(weeklyMap.values()).map((item) => ({
        timestamp: item.timestamp,
        value: item.value / item.count,
      }));
    } else if (timeframe === "monthly") {
      const monthlyMap = new Map();

      data.forEach((item) => {
        const monthStart = startOfMonth(parseISO(item.timestamp));
        const monthKey = monthStart.toISOString();
        if (!monthlyMap.has(monthKey)) {
          monthlyMap.set(monthKey, {
            timestamp: monthStart,
            value: 0,
            count: 0,
          });
        }
        const monthData = monthlyMap.get(monthKey);
        monthData.value += item.value;
        monthData.count += 1;
        monthlyMap.set(monthKey, monthData);
      });
      filtered = Array.from(monthlyMap.values()).map((item) => ({
        timestamp: item.timestamp,
        value: item.value / item.count,
      }));
    }

    setFilteredData(filtered);
  };

  const formatXAxis = (tickItem, timeframe) => {
    try {
      const date = moment(tickItem);
      console.log("date: ", date);

      if (timeframe === "daily" || timeframe === "weekly") {
        return date.format("MMM DD"); // e.g., "Jun 26"
      } else if (timeframe === "monthly") {
        return date.format("MMM YYYY"); // e.g., "Jun 2024"
      }
    } catch (error) {
      console.log(error, tickItem);
      return tickItem;
    }
  };

  const handleTimeframeChange = (event) => {
    setTimeFrame(event.target.value);
  };

  const exportChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "chart.png";
        link.click();
      });
    }
  };

  return (
    <div className="App">
      <ChartComponent
        timeframe={timeframe}
        handleTimeframeChange={handleTimeframeChange}
        exportChart={exportChart}
        filteredData={filteredData}
        formatXAxis={formatXAxis}
        chartRef={chartRef}
      />
    </div>
  );
}

export default App;
