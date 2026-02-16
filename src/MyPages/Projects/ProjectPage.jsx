import React, { useEffect, useState } from 'react'
import ProjectTable from './ProjectTable'
import {
  CButton,
  CCol,
  CRow,
  CWidgetStatsA,
  CWidgetStatsF,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { FaPlusCircle } from 'react-icons/fa'
import { cilSearch } from '@coreui/icons'

import { cilChartPie, cilCheckCircle, cilXCircle, cilLayers } from '@coreui/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CChartLine, CChartBar } from '@coreui/react-chartjs'
import ProjectBarChart from './ProjectBarChart'

const API_URL = import.meta.env.VITE_API_URL

function ProjectPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshStats, setRefreshStats] = useState(false)
const role = localStorage.getItem("role");
  const [stats, setStats] = useState({
    total: 0,
    Active: 0,
    Completed: 0,
    Canceled: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/project/project-stats-widgets`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching project stats:', error)
      }
    }

    fetchStats()
  }, [refreshStats])

  return (
    <div>
      <>
        <CRow>
          <CCol xs={6} md={3}>
            <CWidgetStatsF
              className="mb-3"
              color="info"
              icon={<CIcon icon={cilLayers} height={24} />}
              title="Total"
              value={stats.total || 0}
            />
          </CCol>

          <CCol xs={6} md={3}>
            <CWidgetStatsF
              className="mb-3"
              color="warning"
              icon={<CIcon icon={cilChartPie} height={24} />}
              title="Active "
              value={stats.Active || 0}
            />
          </CCol>

          <CCol xs={6} md={3}>
            <CWidgetStatsF
              className="mb-3"
              color="success"
              icon={<CIcon icon={cilCheckCircle} height={24} />}
              title="Completed "
              value={stats.Completed || 0}
            />
          </CCol>

          <CCol xs={6} md={3}>
            <CWidgetStatsF
              className="mb-3"
              color="danger"
              icon={<CIcon icon={cilXCircle} height={24} />}
              title="Canceled"
              value={stats.Canceled || 0}
            />
          </CCol>
        </CRow>
      </>

      {/* Heading and Add Project button */}
      <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
        <h2 className="mt-4">Project List</h2>

        <div className="d-flex align-items-center gap-2">
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilSearch} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="Search Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px', height: '35px' }}
            />
          </CInputGroup>
{role === "admin" && (
 <Link to="/projects/add-projects">
            <CButton color="primary" size="md" className="me-md-2 d-flex align-items-center gap-2 text-nowrap">
              <FaPlusCircle size={10} />
              <span className="small">Add Project</span>
            </CButton>
          </Link>
)}
         
        </div>
      </div>

      
      <div className="mt-4">
        <ProjectTable
          searchTerm={searchTerm}
          onProjectChange={() => setRefreshStats((prev) => !prev)}
        />
      </div>
    </div>
  )
}

export default ProjectPage
