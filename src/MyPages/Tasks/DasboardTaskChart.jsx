import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TaskChart = () => {
  const [data, setData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTaskChartData();
  }, []);

  const fetchTaskChartData = async () => {
    try {
      const res = await axios.get(`${API_URL}/task/task-status-chart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // Format the data for Recharts
      const formatted = monthNames.map((month, index) => ({
        name: month,
        total: res.data.toDo[index] + res.data.inProgress[index] + res.data.inReview[index] + res.data.done[index],
        inProgress: res.data.inProgress[index],
        completed: res.data.done[index],
      }));

      setData(formatted);
    } catch (error) {
      console.error("Error fetching task chart data:", error);
    }
  };
  const cardStyle = {
  width: "100%",
  height: "400px",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
};


 return (
  <div className="card shadow-sm" style={cardStyle}>
    <h5 className="mb-3 text-center fw-bold">Task Overview (Monthly)</h5>

    <div style={{ width: "100%", height: "320px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#45a0f5ff" strokeWidth={2.5} />
          <Line type="monotone" dataKey="inProgress" stroke="#fabc40ff" strokeWidth={2.5} />
          <Line type="monotone" dataKey="completed" stroke="#4bbd77ff" strokeWidth={2.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

};

export default TaskChart;
