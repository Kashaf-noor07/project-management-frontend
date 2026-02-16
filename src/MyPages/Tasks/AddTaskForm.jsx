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
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { FaSpinner, FaEdit, FaSave, FaTimes } from "react-icons/fa"
const API_URL = import.meta.env.VITE_API_URL

const AddTaskForm = ({ existingTask = null, isEditMode = false, setVisible, fetchTasks }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    assignedTo: [],
    status: '',
    priority: '',
    startDate: '',
    dueDate: '',
    attachments: [],
    comments: [{ comment: '' }],
  })

  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState([]) 
  const [existingFiles, setExistingFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [validated, setValidated] = useState(false)
const role = localStorage.getItem("role")
  const navigate = useNavigate()

  // Fetch Projects
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get(`${API_URL}/project/active-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProjects(res.data.projects || []))
      .catch((err) => console.error('Error fetching projects:', err))
  }, [])

  // Fetch Project Members
  useEffect(() => {
    if (!formData.projectId) return
    const token = localStorage.getItem('token')
    axios
      .get(`${API_URL}/project/project-members/${formData.projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembers(res.data.members || []))
      .catch((err) => console.error('Error fetching project members:', err))
  }, [formData.projectId])

  // Pre-fill form for edit
  useEffect(() => {
    if (existingTask && isEditMode) {
      const previews = (existingTask.attachments || []).map((file) => ({
        src: `${API_URL}/uploads/tasks/${file}`,
        name: file,
        existing: true,
      }));

      setExistingFiles(previews);
      setPreview(previews);

      setFormData({
        projectId: existingTask.projectId?._id || '',
        title: existingTask.title || '',
        description: existingTask.description || '',
        assignedTo: existingTask.assignedTo?.map((m) => m._id) || [],
        status: existingTask.status,
        priority: existingTask.priority ,
        startDate: existingTask.startDate?.split('T')[0] || '',
        dueDate: existingTask.dueDate?.split('T')[0] || '',
        comments: existingTask.comments || [{ comment: '' }],
        attachments: [],
      });
    } else {
      setPreview([]);
      setExistingFiles([]);
    }
  }, [existingTask, isEditMode]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: files }));

    const filePreviews = files.map((file) => ({
      src: URL.createObjectURL(file),
      name: file.name,
      existing: false,
    }));

    setPreview((prev) => [...prev, ...filePreviews]);
  };

  const removePreview = (file, fromExisting = false) => {
    if (fromExisting) {
      setRemovedFiles((prev) => [...prev, file.name]);
      setExistingFiles((prev) => prev.filter((f) => f.name !== file.name));
      setPreview((prev) => prev.filter((f) => f.name !== file.name));
    } else {
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((f) => f.name !== file.name),
      }));
      setPreview((prev) => prev.filter((f) => f.name !== file.name));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
    data.append('projectId', formData.projectId)
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('status', formData.status)
    data.append('priority', formData.priority)
    data.append('startDate', formData.startDate)
    data.append('dueDate', formData.dueDate)
    data.append('assignedTo', JSON.stringify(formData.assignedTo))
    data.append('comments', JSON.stringify(formData.comments))
    formData.attachments.forEach((file) => data.append('attachments', file))
    data.append("removedFiles", JSON.stringify(removedFiles));

    try {
      if (isEditMode && existingTask?._id) {
        await axios.put(`${API_URL}/task/update-task/${existingTask._id}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        })
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Task updated successfully!',
          showConfirmButton: false,
          timer: 3000,
        })
        if (fetchTasks) fetchTasks()
        setVisible(false)
      } else {
        await axios.post(`${API_URL}/task/add-task`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        })
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Task added successfully!',
          showConfirmButton: false,
          timer: 3000,
        })
        setTimeout(() => navigate('/tasks'), 3000)
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
   
          <h4 className="fw-bold p-2 px-2">{isEditMode ? 'Update Task' : 'Add Task'}</h4>
       

        <CCardBody>
          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            {role === "admin" &&(
              <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-calendar-week-fill"></i>
    Task Information
  </legend>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Task Title</CFormLabel>
                <CFormInput
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please enter task title."
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  rows={1}
                  name="description"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please enter task description."
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please select a status."
                >
                  <option value="">Select Status</option>
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>In Review</option>
                  <option>Done</option>
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormLabel>Priority</CFormLabel>
                <CFormSelect
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please select a priority."
                >
                  <option value="">Select Priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </CFormSelect>
              </CCol>
            </CRow>
</fieldset>

            )}

{role === "admin" && (
  <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-calendar-week-fill"></i>
    Team Members
  </legend>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Project</CFormLabel>
                <CFormSelect
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please select a project."
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName} ({project.status})
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormLabel>Assigned To (Members)</CFormLabel>
                <Select
                  isMulti
                  isSearchable={false}
                  name="assignedTo"
                  options={members.map((m) => ({ value: m._id, label: m.name }))}
                  value={members
                    .filter((m) => formData.assignedTo.includes(m._id))
                    .map((m) => ({ value: m._id, label: m.name }))}
                  onChange={(selectedOptions) =>
                    setFormData({
                      ...formData,
                      assignedTo: selectedOptions.map((opt) => opt.value),
                    })
                  }
                  placeholder="Select one or more members..."
                  classNamePrefix="select"
                />
                <small className="text-muted">Optional: You can select multiple members</small>
              </CCol>
            </CRow>
</fieldset>
)}
       

      {role === "admin" && (
 <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-calendar-week-fill"></i>
    Deadline
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

           
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Upload Files (Optional)</CFormLabel>
                <CFormInput type="file" name="attachments" multiple onChange={handleFileChange} />

                {preview.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {preview.map((file, index) => (
                      <div key={index} className="position-relative">
                        <button
                          type="button"
                          className="btn-close position-absolute top-0 end-0 bg-danger p-1 text-white"
                          aria-label="Remove"
                          onClick={() => removePreview(file, !!file.existing)}
                          style={{ transform: "translate(40%, -40%)", fontSize: "0.6rem" }}
                        ></button>

                        {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img
                            src={file.src}
                            alt={file.name}
                            className="border rounded"
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="border rounded d-flex align-items-center justify-content-center bg-light"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <span className="text-muted small">
                              {file.name.split(".").pop().toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CCol>
<CCol md={6}>
  <CFormLabel>Comments</CFormLabel>

  {formData.comments.length > 0 &&
    formData.comments.map((c, index) => (
      <div key={index} className="d-flex align-items-center mb-2">
        <CFormInput
          type="text"
          name="comment"
          placeholder={`Comment ${index + 1}`}
          value={c.comment}
          onChange={(e) => {
            const updated = [...formData.comments]
            updated[index].comment = e.target.value
            setFormData({ ...formData, comments: updated })
          }}
        />
        <button
          type="button"
          className="btn btn-danger btn-sm ms-2"
          onClick={() => {
            const updated = formData.comments.filter((_, i) => i !== index)
            setFormData({ ...formData, comments: updated })
          }}
        >
          Remove
        </button>
      </div>
    ))}



  {/* Add comment button always visible */}
  <button
    type="button"
    className="btn btn-primary btn-sm flex mt-2"
    onClick={() =>
      setFormData({
        ...formData,
        comments: [...formData.comments, { comment: '' }],
      })
    }
  >
    + Add Comment
  </button>
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
  <CRow>
       <CCol md={12}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please select a status."
                >
                  <option value="">Select Status</option>
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>In Review</option>
                  <option>Done</option>
                </CFormSelect>
              </CCol>
     
</CRow>
                </fieldset>

      )}
        
            <div className="d-flex justify-content-end gap-2 mt-3">
              <CButton type="button" color="secondary" onClick={() => {
                  if (setVisible) setVisible(false)
                  else navigate('/tasks')
                }}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit" disabled={loading}>
                 {loading ? (
                   <>
                     <FaSpinner className="me-2 fa-spin" />
                     {isEditMode ? "Updating..." : "Adding..."}
                   </>
                 ) : isEditMode ? (
                   <>
                     <FaEdit className="me-2" />
                     Update tASK
                   </>
                 ) : (
                   <>
                     <FaSave className="me-2" />
                     Save Task
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

export default AddTaskForm
