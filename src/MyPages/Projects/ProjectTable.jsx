import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { FaEdit, FaTrash, FaEye, FaPaperclip, FaPen } from 'react-icons/fa'
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component'
import AddProjectForm from './AddProjectForm'
import ProjectDetailsPage from './ProjectDetailsPage'
import ProjectImageCrousal from './ProjectImageCrousal'

function ProjectTable({ searchTerm, onProjectChange }) {
  const [projects, setProjects] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [projectDetails, setProjectDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshStats, setRefreshStats] = useState(false)

  const [carouselVisible, setCarouselVisible] = useState(false)
  const [carouselAttachments, setCarouselAttachments] = useState([])

  const API_URL = import.meta.env.VITE_API_URL
const role = localStorage.getItem("role")


const customStyles = {
  table: {
   
  },
  headRow: {
    style: {
      borderBottom: "1px solid #dee2e6", 
   
    },
  },
  headCells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
      borderRight: "1px solid #dee2e6", 
      fontWeight: 600,
    },
  },
  rows: {
    style: {
      borderBottom: "1px solid #dee2e6", 
    },
  },
  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
      borderRight: "1px solid #dee2e6", 
    },
  },
};




  // ✅ Fetch Projects
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/project/project-table`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(res.data.projects || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // ✅ Filter projects based on search term
  const filteredProjects = projects.filter((p) =>
    [
      p.projectName,
      p.clientId?.clientName,
      p.status,
      p.assignedMembers?.map((m) => m.name || m.email).join(', '),
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm?.toLowerCase() || ''),
  )

  // 🗑️ Delete Project
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0c66b6ff',
      confirmButtonText: 'Yes, delete it!',
    })

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`${API_URL}/project/delete-project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        Swal.fire('Deleted!', 'Project has been deleted.', 'success')
        fetchProjects()
        onProjectChange()
      } catch (err) {
        Swal.fire('Error', 'Failed to delete project.', 'error')
        console.error('Error deleting project:', err)
      }
    }
  }

  // 📋 Show Project Details
  const handleShowDetails = async (projectId) => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API_URL}/project/project-details/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectDetails(res.data)
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Error fetching project details:', error)
    }
  }

  // ✏️ Edit Project
  const handleEdit = (project) => {
    setSelectedProject(project)
    setVisible(true)
  }

  // ✅ Define table columns
  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1,
      width: '60px',
      center: true,
    },
    {
      name: 'Project Name',
      selector: (row) => row.projectName,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Client',
      selector: (row) => row.clientId?.clientName || '—',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Progress',
      selector: (row) => `${row.progress}%`,
      center: true,
      sortable: true,
    },
    {
      name: 'Members',
      selector: (row) =>
        row.assignedMembers?.length
          ? row.assignedMembers.map((m) => m.name || m.email).join(', ')
          : '—',
      wrap: true,
    },
  
    {
      name: 'Status',
      cell: (row) => (
        <span
          className={` badge ${
            row.status === 'Completed'
              ? 'bg-success'
              : row.status === 'Active'
                ? 'bg-warning'
                : row.status === 'Canceled'
                  ? 'bg-danger'
                  : row.status === 'On Hold'
                    ? 'bg-info'
                    : 'bg-secondary'
          }`}
        >
          {row.status}
        </span>
      ),
      center: true,
    },
        {
      name: 'Due Date',
      selector: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—'),
      center: true,
      sortable: true,
    },
    {
      name: 'Attachments',
      cell: (row) => {
        const attachments = row.attachments?.filter((file) => !file.endsWith('.zip')) || []
        if (attachments.length === 0) return '—'

        return (
          <div className="d-flex align-items-center gap-2">
            {attachments.slice(0, 2).map((file, i) => {
              const fileUrl = `${API_URL}/uploads/tasks/${file}`
              const fileName = file.split('/').pop().toLowerCase()
              const isImage = /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(fileName)
              const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName)
              const isPDF = /\.pdf$/i.test(fileName)

              const commonStyle =
                'd-flex align-items-center justify-content-center border rounded bg-light'
              const sizeClass = 'p-0' 

              if (isImage) {
                return (
                  <img
                    key={i}
                    src={fileUrl}
                    alt={fileName}
                    className="rounded border"
                    style={{
                      width: '25px',
                      height: '25px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setCarouselAttachments(attachments)
                      setCarouselVisible(true)
                    }}
                  />
                )
              }

              if (isVideo) {
                return (
                  <div
                    key={i}
                    className={`${commonStyle} ${sizeClass} d-flex align-items-center justify-content-center`}
                    style={{
                      width: '25px',
                      height: '25px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                    }}
                    onClick={() => {
                      setCarouselAttachments(attachments) // Pass all attachments
                      setCarouselVisible(true) // Open the carousel
                    }}
                    title={fileName}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/136/136530.png"
                      alt="Video"
                      style={{ width: '22px', height: '22px' }}
                    />
                  </div>
                )
              }

              if (isPDF) {
                return (
                  <div
                    key={i}
                    className={`${commonStyle} ${sizeClass} d-flex align-items-center justify-content-center`}
                    style={{
                      width: '25px',
                      height: '25px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                    }}
                    onClick={() => {
                      setCarouselAttachments(attachments)
                      setCarouselVisible(true)
                    }}
                    title={fileName}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                      alt="PDF"
                      style={{ width: '22px', height: '22px' }}
                    />
                  </div>
                )
              }

              return (
                <div
                  key={i}
                  className={`${commonStyle} ${sizeClass} d-flex align-items-center justify-content-center`}
                  style={{
                    width: '25px',
                    height: '25px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f8f9fa',
                  }}
                  onClick={() => {
                    setCarouselAttachments(attachments)
                    setCarouselVisible(true)
                  }}
                  title={fileName}
                >
                  <FaPaperclip className="text-secondary" />
                </div>
              )
            })}

            {attachments.length > 2 && (
              <span
                className="text-muted small d-flex flex-column justify-content-center"
                title={attachments.slice(2).join('\n')}
              >
                {`+${attachments.length - 2}`.split('').map((char, index) => (
                  <span key={index}>{char}</span>
                ))}
              </span>
            )}
          </div>
        )
      },
      center: true,
    },

    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex justify-content-center align-items-center gap-3">
          <FaEye
            title="View Project"
            className="text-success"
            style={{ cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => handleShowDetails(row._id)}
          />

          <FaPen
            title="Edit Project"
            className="text-primary"
            style={{ cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => handleEdit(row)}
          />
{ role === "admin" && (
    <FaTrash
            title="Delete Client"
            className="text-danger"
            style={{ cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => handleDelete(row._id)}
          />
)}
        
        </div>
      ),
      center: true,
    },
  ]

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner variant="grow" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredProjects}
          pagination
          paginationPerPage={10}
                  customStyles={customStyles}
          paginationRowsPerPageOptions={[ 10, 20,30]}
          highlightOnHover
          striped
          responsive
          persistTableHead
          noDataComponent="No projects found"
        />
      )}

      {/* ✏️ Edit Project Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Project</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <AddProjectForm
            existingProject={selectedProject}
            isEditMode={true}
            fetchProjects={fetchProjects}
            setVisible={setVisible}
            onProjectChange={() => setRefreshStats((prev) => !prev)}
          />
        </CModalBody>
      </CModal>

      {/* 📋 Project Details Modal */}
      <ProjectDetailsPage
        visible={showDetailsModal}
        setVisible={setShowDetailsModal}
        details={projectDetails}
      />

      <ProjectImageCrousal
        visible={carouselVisible}
        setVisible={setCarouselVisible}
        attachments={carouselAttachments}
        apiUrl={API_URL}
      />
    </>
  )
}

export default ProjectTable
