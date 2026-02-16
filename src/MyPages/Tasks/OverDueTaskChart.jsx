import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CCard, CCardBody } from "@coreui/react";
import { CChartPie } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";

function OverDueTaskChart() {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const res = await axios.get(`${API_URL}/task/overdue-task-chart-data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { totalTasks, doneTasks, overdueCount, statusCounts  } = res.data;

      setChartData({
        labels: ["Total Tasks","Done", "Overdue", "To Do", "In Progress", "In Review"],
        datasets: [
          {
            data: [totalTasks, doneTasks,overdueCount, statusCounts["To Do"], statusCounts["In Progress"], statusCounts["In Review"],],
            backgroundColor: ["#36A2EB", "#05C224", "#FF6384","#f71b2eff","#fcd00eff","#48d4f7ff"],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Handle chart container resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(containerRef.current.offsetWidth);
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Update theme colors dynamically
  useEffect(() => {
    const updateColors = () => {
      const chartInstance = chartRef.current;
      if (chartInstance) {
        const { options } = chartInstance;

        if (options.plugins?.legend?.labels) {
          options.plugins.legend.labels.color = getStyle("--cui-body-color");
        }

        chartInstance.update();
      }
    };

    document.documentElement.addEventListener("ColorSchemeChange", updateColors);
    return () =>
      document.documentElement.removeEventListener(
        "ColorSchemeChange",
        updateColors
      );
  }, []);

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
    },
  };

  return (
    <CCard
      className="mb-4 shadow-md"
      style={{
        width: "440px",
        height: "400px",
        borderRadius: "10px",
      }}
    >
      <h3 className="text-xl font-semibold mb-3 text-gray-700 ms-4 mt-4">
        Tasks Overview
      </h3>

      <CCardBody
        ref={containerRef}
        style={{ height: "320px", position: "relative" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {chartData ? (
            <CChartPie
              data={chartData}
              options={options}
              ref={chartRef}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </CCardBody>
    </CCard>
  );
}

export default OverDueTaskChart;
