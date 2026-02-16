import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilOptions } from '@coreui/icons'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import ClientChart from '../../MyPages/Clients/ClientChart'
import ProjectBarChart from '../../MyPages/Projects/ProjectBarChart'
import DashboardTaskChart from '../../MyPages/Tasks/DasboardTaskChart'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CWidgetStatsA,
} from '@coreui/react'

const Dashboard = () => {
  const [totalClients, setTotalClients] = useState(0)
  const [monthlyClients, setMonthlyClients] = useState([])
  const [totalProjects, setTotalProjects] = useState(0)
  const [monthlyProjects, setMonthlyProjects] = useState([])
  const [totalTasks, setTotalTasks] = useState(0)
  const [monthlyTasks, setMonthlyTasks] = useState([])
  const role = localStorage.getItem('role')
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchTotals = async () => {
      try {
        const [clientsRes, projectsRes, tasksRes] = await Promise.all([
          axios.get(`${API_URL}/client/total-client`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/project/total-project`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/task/total-task`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setTotalClients(clientsRes.data.totalClients)
        setMonthlyClients(clientsRes.data.monthlyClients || [])
        setTotalProjects(projectsRes.data.totalProjects)
        setMonthlyProjects(projectsRes.data.monthlyProjects || [])
        setTotalTasks(tasksRes.data.totalTasks)
        setMonthlyTasks(tasksRes.data.monthlyTasks || [])
      } catch (error) {
        console.error('Error fetching dashboard totals:', error)
      }
    }

    fetchTotals()
  }, [])

  const handleViewClients = () => navigate('/clients')
  const handleViewProjects = () => navigate('/projects')
  const handleViewTasks = () => navigate('/tasks')

  const monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return (
    <>
      <CRow>
        {/* Total Clients */}
        {role === 'admin' && (
          <CCol sm={4}>
            <CWidgetStatsA
              className="mb-4"
              color="info"
              value={<>{totalClients || 0} </>}
              title="Total Clients"
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-white" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={handleViewClients}>View Clients</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: monthLabels,
                    datasets: [
                      {
                        label: 'Clients Growth',
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: '#39f',
                        data: monthlyClients.length ? monthlyClients : Array(12).fill(0),
                      },
                    ],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false,
                    scales: { x: { display: false }, y: { display: false } },
                    elements: {
                      line: { borderWidth: 1 },
                      point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                    },
                  }}
                />
              }
            />
          </CCol>
        )}

        {/* Total Projects */}

         <CCol sm={role === "admin" ? 4 : 6}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={<>{totalProjects || 0} </>}
            title="Total Projects"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-white" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={handleViewProjects}>View Projects</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: monthLabels,
                  datasets: [
                    {
                      label: 'Projects',
                      backgroundColor: 'rgba(255,255,255,.2)',
                      borderColor: 'rgba(255,255,255,.55)',
                      data: monthlyProjects.length ? monthlyProjects : Array(12).fill(0),
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            }
          />
        </CCol>

        {/* Total Tasks */}
         <CCol sm={role === "admin" ? 4 : 6}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={<>{totalTasks || 0} </>}
            title="Total Tasks"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-white" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={handleViewTasks}>View Tasks</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: monthLabels,
                  datasets: [
                    {
                      label: 'Tasks',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: '#f87171',
                      data: monthlyTasks.length ? monthlyTasks : Array(12).fill(0),
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: {
                    line: { borderWidth: 1, tension: 0.4 },
                    point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

       <div>
      <CRow className="mt-3">
        
       
        <CCol sm={role === "admin" ? 6 : 12}>
          <DashboardTaskChart />
        </CCol>

      
        {role === "admin" && (
          <CCol sm={6}>
            <ClientChart />
          </CCol>
        )}

       
        <CCol sm={12} className="mt-3">
          <ProjectBarChart />
        </CCol>

      </CRow>
    </div>
    </>
  )
}

export default Dashboard
