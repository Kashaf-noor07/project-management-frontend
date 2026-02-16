import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { CCard, CCardBody } from "@coreui/react";


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(6px)",
          padding: "10px 14px",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
          border: "1px solid #e3e3e3"
        }}
      >
        <h6 className="mb-1 fw-bold">{label}</h6>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: "14px" }}>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                background: p.color,
                marginRight: "6px",
                borderRadius: "3px"
              }}
            ></span>
            {p.name}: <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function MemberRangeChart({ memberId }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [range, setRange] = useState("currentWeek");
  const [activeTab, setActiveTab] = useState("tasks");

  const [taskStats, setTaskStats] = useState(null);
  const [projectStats, setProjectStats] = useState(null);

  const fetchTaskStats = async (selectedRange = range) => {
    try {
      const res = await axios.get(
        `${API_URL}/task/member/${memberId}/task-stats?range=${selectedRange}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setTaskStats(res.data.stats);
    } catch (err) {
      console.error("Error loading task bar stats:", err);
    }
  };

  const fetchProjectStats = async (selectedRange = range) => {
    try {
      const res = await axios.get(
        `${API_URL}/project/member/${memberId}/project-stats?range=${selectedRange}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setProjectStats(res.data.stats);
    } catch (err) {
      console.error("Error loading project bar stats:", err);
    }
  };

  useEffect(() => {
    fetchTaskStats();
    fetchProjectStats();
  }, [memberId]);

  const handleRangeChange = (value) => {
    setRange(value);
    fetchTaskStats(value);
    fetchProjectStats(value);
  };

  let chartData = [];

  if (activeTab === "tasks" && taskStats) {
    chartData = [
      {
        name: "Tasks",
        total: taskStats.totalTasks,
        todo: taskStats.todo,
        inProgress: taskStats.inProgress,
        inReview: taskStats.inReview,
        done: taskStats.done,
        overdue: taskStats.overdueTasks,
      },
    ];
  }

  if (activeTab === "projects" && projectStats) {
    chartData = [
      {
        name: "Projects",
        total: projectStats.totalProjects,
        notStarted: projectStats.notStarted,
        onHold: projectStats.onHold,
        active: projectStats.active,
        completed: projectStats.completed,
        canceled: projectStats.canceled,
        overdue: projectStats.overdueProjects,
      },
    ];
  }

  return (
    <CCard
      className="mb-4 shadow-sm"
      style={{
        borderRadius: "15px",
        height: "440px",
        boxShadow: "0px 4px 18px rgba(0,0,0,0.08)"
      }}
    >
      <div className="p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <button
            className={`btn ${activeTab === "tasks" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("tasks")}
            style={{ transition: "0.3s ease" }}
          >
            Tasks
          </button>

          <button
            className={`btn ${activeTab === "projects" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("projects")}
            style={{ transition: "0.3s ease" }}
          >
            Projects
          </button>
        </div>

        <select
          className="form-select"
          value={range}
          onChange={(e) => handleRangeChange(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="currentWeek">Current Week</option>
          <option value="lastWeek">Last Week</option>
          <option value="currentMonth">Current Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
        </select>
      </div>

      <CCardBody style={{ height: "330px" }}>
    
        <div className="chart-wrapper" key={activeTab}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 13, fontWeight: 600 }}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {activeTab === "tasks" && (
                <>
                  <Bar dataKey="total" fill="#3175aa" name="Total Tasks" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="todo" fill="#4f585f" name="To Do" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="inProgress" fill="#ffc107" name="In Progress" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="inReview" fill="#0dcaf0" name="In Review" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="done" fill="#198754" name="Done" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="overdue" fill="#dc3545" name="Overdue" radius={[6, 6, 0, 0]} />
                </>
              )}

              {activeTab === "projects" && (
                <>
                  <Bar dataKey="total" fill="#3dccf8" name="Total Projects" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="notStarted" fill="#5b6166" name="Not Started" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="onHold" fill="#3261c5" name="On Hold" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="active" fill="#ffc107" name="Active" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" fill="#198754" name="Completed" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="canceled" fill="#c22e3c" name="Canceled" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="overdue" fill="#ff073a" name="Overdue" radius={[6, 6, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CCardBody>

 <style>{`
  .chart-wrapper {
    height: 100%;         
    width: 100%;
    opacity: 0;
    transform: translateY(12px);
    animation: fadeSlideIn 0.45s ease forwards;
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}</style>

    </CCard>
  );
}

export default MemberRangeChart;
