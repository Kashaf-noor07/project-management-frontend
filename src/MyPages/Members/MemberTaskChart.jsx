import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/react-chartjs'

const MemberTaskChart = ({ memberId }) => {
  const chartRef = useRef(null)
  const [taskData, setTaskData] = useState({
    totalAssigned: 0,
    doneTasks: 0,
    overdueTasks: 0,
  })

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    // Fetch member task stats
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/member-chart-data?memberId=${memberId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })

        setTaskData(res.data.stats)
      } catch (err) {
        console.error('Error fetching member task data:', err)
      }
    }

    fetchData()
  }, [memberId])

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chartInstance = chartRef.current
      if (chartInstance) {
        const { options } = chartInstance
        if (options.plugins?.legend?.labels) {
          options.plugins.legend.labels.color = getStyle('--cui-body-color')
        }
        chartInstance.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

    return () =>
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
  }, [])

  const data = {
    labels: ['Done Tasks', 'Overdue Tasks', 'Pending Tasks'],
    datasets: [
      {
        backgroundColor: ['#4bbd77ff', '#ff4d4f', '#ffc658'],
        data: [
          taskData.doneTasks,
          taskData.overdueTasks,
          taskData.totalAssigned - taskData.doneTasks, // remaining assigned but not done
        ],
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        labels: {
          color: getStyle('--cui-body-color'),
        },
      },
    },
  }

  return <CChart type="doughnut" data={data} options={options} ref={chartRef} />
}

export default MemberTaskChart
