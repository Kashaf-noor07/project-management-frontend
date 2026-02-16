import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getStyle } from "@coreui/utils";
import { CChart } from "@coreui/react-chartjs";
import { CCard, CCardBody } from "@coreui/react";

function ClientChart() {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/client/client-chart-data`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const { labels, dataValues } = res.data;
      setChartData({
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: ["#36A2EB", "#34c955ff", "#FF6384"],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // ✅ This fixes the small chart issue by recalculating width after mount
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current;
      if (chartInstance) {
        const { options } = chartInstance;
        if (options.plugins?.legend?.labels) {
          options.plugins.legend.labels.color = getStyle("--cui-body-color");
        }
        if (options.scales?.r?.grid) {
          options.scales.r.grid.color = getStyle("--cui-border-color-translucent");
        }
        chartInstance.update();
      }
    };

    document.documentElement.addEventListener("ColorSchemeChange", handleColorSchemeChange);
    return () => {
      document.documentElement.removeEventListener("ColorSchemeChange", handleColorSchemeChange);
    };
  }, []);

  const options = {
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        labels: {
          color: getStyle("--cui-body-color"),
        },
      },
    },
    scales: {
      r: {
        grid: { color: getStyle("--cui-border-color-translucent") },
        ticks: { color: getStyle("--cui-body-color") },
        angleLines: { color: getStyle("--cui-border-color-translucent") },
        pointLabels: { color: getStyle("--cui-body-color") },
        beginAtZero: true,
      },
    },
  };
  const cardStyle = {
  width: "100%",
  height: "400px",
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
};


  return (
    
   <CCard className="mb-4 shadow-sm" style={cardStyle}>
    
      <h5 className="mb-3 mt-3 text-center fw-bold">
        Client Overview
      </h5>

      <CCardBody ref={containerRef} style={{ height: "320px", position: "relative" }}>
        {chartData && containerWidth > 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "280px",
              position: "relative",
            }}
          >
            <CChart
              type="polarArea"
              data={chartData}
              options={options}
              ref={chartRef}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ) : (
          <p className="text-center">Loading chart...</p>
        )}
      </CCardBody>
    </CCard>
  );
}

export default ClientChart;
