import React, { useEffect, useState } from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import axios from "axios";
import { CCard, CCardBody } from "@coreui/react";

function ProjectChart() {
  const [chartData, setChartData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/project/project-chart-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChartData(response.data);
      } catch (err) {
        console.error("Error fetching project chart data:", err);
      }
    };
    fetchChartData();
  }, []);

  return (
    <CCard
      className="mb-4 shadow-sm"
      style={{
        width: "100%",   
        height: "420px",  
        borderRadius: "10px",
       
      }}
    >
      <h5 className="mb-3 mt-3 text-center fw-bold">Project Overview (Monthly)</h5>

      <CCardBody style={{ height: "340px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: "10px" }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" height={36} />

           
            <Bar dataKey="total" barSize={25} fill="#0e94e2ff" name="Total" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" barSize={20} fill="#1b831eff" name="Completed" radius={[4, 4, 0, 0]} />

          
            <Line
              type="monotone"
              dataKey="canceled"
              stroke="#f32121ff"
              strokeWidth={3}
              dot={true}
              name="Canceled"
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#fdda0fff"
              strokeWidth={3}
              dot={true}
              name="Active"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CCardBody>
    </CCard>
  );
}

export default ProjectChart;
