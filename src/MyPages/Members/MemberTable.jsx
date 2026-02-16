import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable, { createTheme } from 'react-data-table-component'
import { CSpinner, CFormSwitch, CInputGroup, CInputGroupText } from '@coreui/react'
import Swal from 'sweetalert2'
import { FaEdit, FaTrash, FaEye, FaPen } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

createTheme(
  'bootstrap',
  {
    text: {
      primary: '#212529',
      secondary: '#495057',
    },
    background: {
      default: '#ffffffff',
    },
    context: {
      background: '#e2e3e5',
      text: '#212529',
    },
    divider: {
      default: '#dee2e6',
    },
    action: {
      hover: 'rgba(0,0,0,.075)',
    },
  },
  'light',
)

const customStyles = {
  table: {
    style: {
      border: '1px solid #dee2e6',
    },
  },
  headRow: {
    style: {
      borderBottom: '1px solid #dee2e6',
    },
  },
  headCells: {
    style: {
      paddingLeft: '12px',
      paddingRight: '12px',
      borderRight: '1px solid #dee2e6',
      fontWeight: 600,
    },
  },
  rows: {
    style: {
      borderBottom: '1px solid #dee2e6',
    },
  },
  cells: {
    style: {
      paddingLeft: '12px',
      paddingRight: '12px',
      borderRight: '1px solid #dee2e6',
    },
  },
}

function MemberTable({ searchTerm }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  const filteredMembers = members.filter((member) =>
    [member.name, member.email].some((field) =>
      field?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/auth/member-table`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMembers(res.data.members || [])
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_URL}/auth/toggle-member/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setMembers((prev) =>
        prev.map((member) =>
          member._id === id ? { ...member, isMemberActive: !member.isMemberActive } : member,
        ),
      )
    } catch (err) {
      console.error('Error toggling member status:', err)
      Swal.fire({
        icon: 'error',
        title: 'Failed to update status',
        text: err.response?.data?.error || 'Something went wrong',
      })
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      width: '70px',
      center: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      center: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
      center: true,
    },
    {
      name: 'Member Status',
      cell: (row) => (
        <div className="d-flex align-items-center justify-content-center gap-2">
          <CFormSwitch
            color="success"
            checked={!!row.isMemberActive}
            onChange={() => handleToggleStatus(row._id)}
            style={{ transform: 'scale(0.9)' }}
          />
          <span
            className={row.isMemberActive ? 'text-success' : 'text-danger'}
            style={{ fontWeight: '500' }}
          >
            {row.isMemberActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
      center: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <FaEye
            className="text-success"
            style={{ cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => navigate(`/member-stats/${row._id}`)}
          />

          <span
            className="fw-semibold text-primary"
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
              borderBottom: '2px solid transparent',
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = 'var(--bs-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
            onClick={() => navigate(`/member-stats/${row._id}`)}
          >
            View Details
          </span>
        </div>
      ),
      center: true,
    },
  ]

  return (
    <div className="mt-4">
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '200px' }}
        >
          <CSpinner color="secondary" />
        </div>
      ) : (
        <div className="bootstrap-bordered-table">
          <DataTable
            columns={columns}
            data={filteredMembers}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            highlightOnHover
            persistTableHead
            striped
            responsive
            noDataComponent="No members found"
          />
        </div>
      )}
    </div>
  )
}

export default MemberTable
