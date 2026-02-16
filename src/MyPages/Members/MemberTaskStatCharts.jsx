import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CChart } from "@coreui/react-chartjs";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CSpinner
} from "@coreui/react";
import MemberRangeChart from "./MemberRangeChart"

function MemberTaskStats() {
  const { id } = useParams();
  const [memberStats, setMemberStats] = useState(null);

  const chartRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/task/member-task-stat/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMemberStats(res.data.member);
    } catch (err) {
      console.error("Error fetching member stats:", err);
    }
  };

  if (!memberStats) return <CSpinner color="primary" />;

  const doughnutData = {
    labels: ["To Do", "In Progress", "In Review", "Done", "Overdue"],
    datasets: [
      {
        backgroundColor: [
          "#4f585fff",
          "#ffc107",
          "#0dcaf0",
          "#198754",
          "#dc3545"
        ],
        data: [
          memberStats.todoTasks,
          memberStats.inProgressTasks,
          memberStats.inReviewTasks,
          memberStats.doneTasks,
          memberStats.overdueTasks
        ]
      }
    ]
  };

  return (
    <>
      <CRow>
        <CCol md={12}>
          <MemberRangeChart memberId={id} />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12}>
          <CCard className="mb-4 shadow-sm" style={{ borderRadius: "10px", height: "520px" }}>
            
            <div className="d-flex gap-3 justify-content-center mt-3">
              <div className="p-3 shadow-sm rounded-3 text-center"
                   style={{ background: "#e8f1ff", width: "22%" }}>
                <div className="fw-semibold text-primary">Total Tasks</div>
                <div className="fw-bold text-primary">{memberStats.totalTasks}</div>
              </div>

              <div className="p-3 shadow-sm rounded-3 text-center"
                   style={{ background: "#ffe8e8", width: "22%" }}>
                <div className="fw-semibold text-danger">Overdue</div>
                <div className="fw-bold text-danger">{memberStats.overdueTasks}</div>
              </div>

              <div className="p-3 shadow-sm rounded-3 text-center"
                   style={{ background: "#fbffbeff", width: "22%" }}>
                <div className="fw-semibold text-warning">Progress</div>
                <div className="fw-bold text-warning">{memberStats.progress}%</div>
              </div>
            </div>

            <CCardBody style={{ height: "420px" }}>
              <CChart
                ref={chartRef}
                type="doughnut"
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                style={{ height: "100%", width: "100%" }}
              />
            </CCardBody>

          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default MemberTaskStats;
