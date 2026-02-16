import React, { useEffect, useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CToaster,
  CToast,
  CToastBody,
  CToastHeader,
  CFormSelect,
  CFormFeedback,
} from '@coreui/react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { FaSpinner, FaEdit, FaSave, FaTimes } from "react-icons/fa"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const API_URL = import.meta.env.VITE_API_URL

const AddProjectForm = ({
  existingProject = null,
  isEditMode = false,
  setVisible,
  fetchProjects,
  onProjectChange,
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startDate: '',
    dueDate: '',
    budget: '',
    status: '',
    clientId: '',
    assignedMembers: [],
    projectSource: '',
    attachments: [],
  })

  const [validated, setValidated] = useState(false)
  const [clients, setClients] = useState([])
  const [members, setMembers] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState([])
  const [existingFiles, setExistingFiles] = useState([])
  const [removedFiles, setRemovedFiles] = useState([])
  const navigate = useNavigate()
const role = localStorage.getItem("role")
  // ✅ Fetch Active Clients
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get(`${API_URL}/client/active-clients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClients(res.data.clients || []))
      .catch((err) => console.error('Error fetching active clients:', err))
  }, [])

  // ✅ Fetch Active Members
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get(`${API_URL}/auth/active-members`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembers(res.data.members || []))
      .catch((err) => console.error('Error fetching active members:', err))
  }, [])

  // ✅ Pre-fill form for edit
  useEffect(() => {
    if (existingProject) {
      const previews = (existingProject.attachments || []).map((file) => ({
        src: `${API_URL}/uploads/tasks/${file}`,
        name: file,
        existing: true,
      }))

      setExistingFiles(previews)
      setPreview(previews)

      setFormData({
        projectName: existingProject.projectName || '',
        description: existingProject.description || '',
        startDate: existingProject.startDate ? existingProject.startDate.split('T')[0] : '',
        dueDate: existingProject.dueDate ? existingProject.dueDate.split('T')[0] : '',
        budget: existingProject.budget || '',
        status: existingProject.status,
        projectSource: existingProject.projectSource,
        clientId: existingProject.clientId?._id || '',
        attachments: [],
        assignedMembers: existingProject.assignedMembers?.map((m) => m._id) || [],
      })
    } else {
      setPreview([])
      setExistingFiles([])
    }
  }, [existingProject])

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Handle file input
  const handleFileChange = (e) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setFormData((prev) => ({ ...prev, attachments: files }))

    const filePreviews = files.map((file) => ({
      src: URL.createObjectURL(file),
      name: file.name,
      existing: false,
    }))

    setPreview((prev) => [...prev, ...filePreviews])
  }

  // ✅ Remove preview (existing or new)
  const removePreview = (file, fromExisting = false) => {
    if (fromExisting) {
      setRemovedFiles((prev) => [...prev, file.name])
      setExistingFiles((prev) => prev.filter((f) => f.name !== file.name))
      setPreview((prev) => prev.filter((f) => f.name !== file.name))
    } else {
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((f) => f.name !== file.name),
      }))
      setPreview((prev) => prev.filter((f) => f.name !== file.name))
    }
  }

  // ✅ Toast helper
  const showToast = (title, message) => {
    setToast(
      <CToast autohide={true} visible={true}>
        <CToastHeader>
          <div className="fw-bold me-auto">{title}</div>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>,
    )
  }

  // ✅ Submit handler with validation + FormData (for attachments)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setValidated(true)
      return
    }

    setValidated(true)
    setLoading(true)
    const token = localStorage.getItem('token')

    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key === 'assignedMembers') {
        data.append(key, JSON.stringify(formData[key]))
      } else if (key !== 'attachments') {
        data.append(key, formData[key])
      }
    })

    formData.attachments.forEach((file) => {
      data.append('attachments', file)
    })

    data.append('removedFiles', JSON.stringify(removedFiles))

    try {
      if (isEditMode && existingProject?._id) {
        await axios.put(`${API_URL}/project/update-project/${existingProject._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Project updated successfully!',
          showConfirmButton: false,
          timer: 3000,
        })
        if (fetchProjects) fetchProjects()
           if (onProjectChange) onProjectChange();
        setVisible(false)
      } else {
        await axios.post(`${API_URL}/project/add-project`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Project added successfully!',
          showConfirmButton: false,
          timer: 3000,
        })
        setTimeout(() => navigate('/projects'), 3000)
      }
    } catch (err) {
      console.error(err)
      showToast('Error', err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CCard className="shadow-sm border-0">
       
          <h4 className="fw-bold p-2 px-4">{isEditMode ? 'Update Project' : 'Add Project'}</h4>
       

        <CCardBody >
          <CForm
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="needs-validation"
          >
            { role === "admin" && (
      <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-kanban"></i>
    Project Information
  </legend>

  <CRow className="mb-3">
    <CCol md={6}>
      <CFormLabel>Project Name</CFormLabel>
      <CFormInput
        type="text"
        name="projectName"
        placeholder="Enter project name"
        value={formData.projectName}
        onChange={handleChange}
        required
        feedbackInvalid="Please provide a project name."
      />
    </CCol>

    <CCol md={6}>
      <CFormLabel>Client</CFormLabel>
      <CFormSelect
        name="clientId"
        value={formData.clientId}
        onChange={handleChange}
        required
        feedbackInvalid="Please select a client."
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client._id} value={client._id}>
            {client.clientName}
          </option>
        ))}
      </CFormSelect>
    </CCol>
  </CRow>

  <CRow className="mb-3">
    <CCol md={6}>
      <CFormLabel>Description</CFormLabel>
      <CFormTextarea
        rows={1}
        name="description"
        placeholder="Enter project description"
        value={formData.description}
        onChange={handleChange}
        required
        feedbackInvalid="Please provide a project description."
      />
    </CCol>

    <CCol md={6}>
      <CFormLabel>Project Source</CFormLabel>
      <CFormSelect
        name="projectSource"
        value={formData.projectSource}
        onChange={(e) => {
          const value = e.target.value
          setFormData({ ...formData, projectSource: value })
        }}
        required
        feedbackInvalid="Please select a valid project source."
      >
        <option value="">Select Project Source</option>
        <option value="Fiver">Fiver</option>
        <option value="Upwork">Upwork</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="Direct Client">Direct Client</option>
        <option value="Referral">Referral</option>
        <option value="Others">Others</option>
      </CFormSelect>

      {/* Show custom input if "Others" selected */}
      {formData.projectSource === 'Others' && (
        <div className="mt-2">
          <CFormInput
            type="text"
            name="customSource"
            placeholder="Please specify project source"
            value={formData.customSource || ''}
            onChange={(e) =>
              setFormData({ ...formData, customSource: e.target.value })
            }
            required
            feedbackInvalid="Please specify the project source."
          />
        </div>
      )}
    </CCol>
  </CRow>
</fieldset>

            )}
    
{role === "admin" && (
 <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-people-fill"></i>
    Team Assignment
  </legend>

  <CRow className="mb-3">
    {/* 👥 Assigned Members */}
    <CCol md={6}>
      <CFormLabel>Assigned Members (Optional)</CFormLabel>
      <Select
        isMulti
        isSearchable={false}
        name="assignedMembers"
        options={members.map((member) => ({
          value: member._id,
          label: member.name,
        }))}
        value={members
          .filter((m) => formData.assignedMembers.includes(m._id))
          .map((m) => ({ value: m._id, label: m.name }))}
        onChange={(selectedOptions) =>
          setFormData({
            ...formData,
            assignedMembers: selectedOptions.map((opt) => opt.value),
          })
        }
        placeholder="Select members..."
        classNamePrefix="select"
      />
      <small className="text-muted">
        You can select multiple members (optional)
      </small>
    </CCol>

    {/* 📎 Attachments */}
    <CCol md={6}>
      <CFormLabel>Upload Files</CFormLabel>
      <CFormInput
        type="file"
        name="attachments"
        multiple
        onChange={handleFileChange}
      />

      {preview.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {preview.map((file, index) => (
            <div key={index} className="position-relative">
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 bg-danger p-1 text-white"
                aria-label="Remove"
                onClick={() => removePreview(file, !!file.existing)}
                style={{
                  transform: 'translate(40%, -40%)',
                  fontSize: '0.6rem',
                }}
              ></button>

              {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={file.src}
                  alt={file.name}
                  className="border rounded"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  className="border rounded d-flex align-items-center justify-content-center bg-light"
                  style={{ width: '40px', height: '40px' }}
                >
                  <span className="text-muted small">
                    {file.name.split('.').pop().toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CCol>
  </CRow>
</fieldset>
)}
        
  {role === "admin" && (
 <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-calendar-week-fill"></i>
    Timeline & Budget
  </legend>

  <CRow className="mb-3">
    <CCol md={6}>
      <CFormLabel>Start Date</CFormLabel>
      <CFormInput
        type="date"
        name="startDate"
        value={formData.startDate}
        min={new Date().toISOString().split('T')[0]}
        onChange={handleChange}
        required
        feedbackInvalid="Please select a start date."
      />
    </CCol>

    <CCol md={6}>
      <CFormLabel>Due Date</CFormLabel>
      <CFormInput
        type="date"
        name="dueDate"
        value={formData.dueDate}
        min={formData.startDate || new Date().toISOString().split('T')[0]}
        onChange={handleChange}
        required
        feedbackInvalid="Please select a due date."
      />
    </CCol>
  </CRow>

  <CRow className="mb-4">
    <CCol md={6}>
      <CFormLabel>Budget</CFormLabel>
      <CFormInput
        type="number"
        name="budget"
        placeholder="Enter budget"
        value={formData.budget}
        onChange={handleChange}
        required
        feedbackInvalid="Please provide a valid budget."
      />
    </CCol>

    <CCol md={6}>
      <CFormLabel>Status</CFormLabel>
      <CFormSelect
        id="validationStatus"
        name="status"
        value={formData.status}
        onChange={handleChange}
        feedbackInvalid="Please select a valid status."
        required
      >
        <option disabled value="">
          Select Status
        </option>
        <option value="Not Started">Not Started</option>
        <option value="Active">Active</option>
        <option value="Canceled">Canceled</option>
        <option value="On Hold">On Hold</option>
        <option value="Completed">Completed</option>
      </CFormSelect>
    </CCol>
  </CRow>
</fieldset>
  )}
  {role === "member" && (
 <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-calendar-week-fill"></i>
   Status
  </legend>

    <CCol md={12}>
      <CFormLabel>Status</CFormLabel>
      <CFormSelect
        id="validationStatus"
        name="status"
        value={formData.status}
        onChange={handleChange}
        feedbackInvalid="Please select a valid status."
        required
      >
        <option disabled value="">
          Select Status
        </option>
        <option value="Not Started">Not Started</option>
        <option value="Active">Active</option>
        <option value="Canceled">Canceled</option>
        <option value="On Hold">On Hold</option>
        <option value="Completed">Completed</option>
      </CFormSelect>
    </CCol>

</fieldset>
  )}
          

            {/* Buttons */}
           <div className="d-flex justify-content-end gap-2 mt-3">
  {/* ❌ Cancel Button */}
  <CButton
    type="button"
    color="secondary"
    onClick={() => {
      if (setVisible) setVisible(false)
      else navigate('/projects')
    }}
  >
    
    Cancel
  </CButton>

  {/* 💾 Save / Update Button */}
  <CButton color="primary" type="submit" disabled={loading}>
    {loading ? (
      <>
        <FaSpinner className="me-2 fa-spin" />
        {isEditMode ? "Updating..." : "Adding..."}
      </>
    ) : isEditMode ? (
      <>
        <FaEdit className="me-2" />
        Update Project
      </>
    ) : (
      <>
        <FaSave className="me-2" />
        Save Project
      </>
    )}
  </CButton>
</div>

          </CForm>
        </CCardBody>
      </CCard>

      <CToaster placement="top-end">{toast}</CToaster>
    </>
  )
}

export default AddProjectForm
