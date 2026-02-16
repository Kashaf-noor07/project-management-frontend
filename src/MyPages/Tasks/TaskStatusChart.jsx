import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function TaskStatusChart() {
  const [chartData, setChartData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchChartData();
  }, []);

const fetchChartData = async () => {
  try {
    const res = await axios.get(`${API_URL}/task/task-status-chart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = res.data;

    const months = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"];

    const formatted = months.map((month, index) => {
      const todo = data.toDo[index] || 0;
      const inProgress = data.inProgress[index] || 0;
      const inReview = data.inReview[index] || 0;
      const done = data.done[index] || 0;

      return {
        month,
        TotalTasks: todo + inProgress + inReview + done,
        ToDo: todo,
        InProgress: inProgress,
        InReview: inReview,
        Done: done,
      };
    });

    setChartData(formatted);

  } catch (err) {
    console.error("Error fetching chart data", err);
  }
};

  return (

    <div
      style={{ width: "600px", height: "400px" }}
      className="bg-white shadow-md rounded p-4 border"
    >
      <h3 className="text-xl font-semibold mb-3 text-gray-700">
        Overall Tasks (Monthly)
      </h3>

      <ResponsiveContainer width="100%" height="80%">
         {chartData ? (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
  <Bar dataKey="TotalTasks" fill="#28a6c5ff" name="Total Tasks" />
          <Bar dataKey="ToDo" fill="#e92f3eff" name="To Do" />
          <Bar dataKey="InProgress" fill="#fcd00eff" name="In Progress" />
          <Bar dataKey="InReview" fill="#48d4f7ff" name="In Review" />
          <Bar dataKey="Done" fill="#1d9e21ff" name="Done" />
        </BarChart>
        ) : (
            <p>Loading chart...</p>
          )}
      </ResponsiveContainer>
    </div>
  );
}

export default TaskStatusChart;
