import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CButton,
  CAvatar,
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {cilSearch } from '@coreui/icons'
import Swal from 'sweetalert2'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
const API_URL = import.meta.env.VITE_API_URL

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info')
  const [editMode, setEditMode] = useState(false)
  const [editPasswordMode, setEditPasswordMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Store real user data
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    joinedDate: '',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
  })

  // Store editable copy
  const [editUser, setEditUser] = useState({})

  // ✅ Fetch user profile on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API_URL}/auth/get-user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const userData = {
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          joinedDate: res.data.user.createdAt || '—',
          profileImage: "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid&w=740&q=80",
        }

        setUser(userData)
        setEditUser(userData)
      } catch (err) {
        console.error('Error fetching user profile:', err)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value })
  }

  // ✅ Cancel → restore original data
  const handleCancel = () => {
    setEditUser({ ...user })
    setEditMode(false)
  }

  //password validation
  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return regex.test(password)
  }

  // ✅ Save edited user info
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.put(
        `${API_URL}/auth/edit-user-profile`,
        { name: editUser.name, email: editUser.email },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      Swal.fire({
        icon: 'success',
        title: 'Profile updated!',
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      })
      setUser({ ...editUser })
      setEditMode(false)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: err.response?.data?.message || 'Something went wrong.',
      })
    }
  }

  const handlePasswordSave = async () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      return Swal.fire('Error', 'All fields are required.', 'error')
    }

    try {
      const token = localStorage.getItem('token')
      const res = await axios.put(
        `${API_URL}/auth/update-user-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      Swal.fire('Success', res.data.message, 'success')
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setEditPasswordMode(false)
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to change password.', 'error')
    }
  }

  return (
    <div className="p-4">
      {/* Header */}
      <CRow className="align-items-center mb-4">
        <CCol sm="auto">
          <CAvatar
            src={user.profileImage}
            size="xl"
            className="border border-2 border-primary"
            shape="rounded-circle"
          />
        </CCol>
        <CCol>
          <div className="ms-3">
            <h2 className="fw-semibold text-dark mb-1">{user.name}</h2>
            <p className="text-muted mb-1">{user.email}</p>
            <p className="text-primary text-capitalize small mb-0">{user.role}</p>
          </div>
        </CCol>
      </CRow>

      {/* Tabs */}
      <CNav variant="tabs" role="tablist">
        <CNavItem>
          <CNavLink
            active={activeTab === 'info'}
            onClick={() => setActiveTab('info')}
            role="button"
          >
            Personal Info
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'password'}
            onClick={() => setActiveTab('password')}
            role="button"
          >
            Change Password
          </CNavLink>
        </CNavItem>
      </CNav>

      <CTabContent className="p-3 border border-top-0 rounded-bottom">
        {/* Personal Info */}
        <CTabPane visible={activeTab === 'info'}>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Name</CFormLabel>
                 <CInputGroup>
                  <CInputGroupText>
                     <CIcon icon={cilUser} />
                  </CInputGroupText>
                    
                <CFormInput
                  type="text"
                  name="name"
                  value={editMode ? editUser.name : user.name}
                  disabled={!editMode}
                  maxLength={40}
                  onChange={handleChange}
                   style={{ textTransform: "capitalize" }}
                />
                </CInputGroup>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Email</CFormLabel>
                 <CInputGroup>
                   <CInputGroupText>
                   @
                  </CInputGroupText>
                <CFormInput
                  type="email"
                  name="email"
                  value={editMode ? editUser.email : user.email}
                  disabled={!editMode}
                  maxLength={40}
                  onChange={handleChange}
                />
                </CInputGroup>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-3 mt-3">
              {!editMode ? (
                <CButton color="primary" className="px-4 py-2" onClick={() => setEditMode(true)}>
                  Edit
                </CButton>
              ) : (
                <>
                  <CButton color="secondary" className="px-4 py-2" onClick={handleCancel}>
                    Cancel
                  </CButton>
                  <CButton color="success" className="px-4 py-2" onClick={handleSave}>
                    Save
                  </CButton>
                </>
              )}
            </div>
          </CForm>
        </CTabPane>

        {/* Password Tab (later) */}
        <CTabPane visible={activeTab === 'password'}>
          <CForm>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel>Old Password</CFormLabel>

                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>

                  <CFormInput
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    maxLength={8}
                    value={formData.oldPassword}
                    disabled={!editPasswordMode}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                  />
                </CInputGroup>

                {!formData.oldPassword && editPasswordMode && (
                  <span className="text-danger mt-2 d-block">Please enter old password first</span>
                )}
              </CCol>

              <CCol md={4}>
                <CFormLabel>New Password</CFormLabel>

                <CInputGroup className="position-relative">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>

                  <CFormInput
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    maxLength={8}
                    placeholder="New Password"
                    value={formData.newPassword}
                    disabled={!editPasswordMode}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />

                  {editPasswordMode && (
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon style={{ width: '20px', height: '20px' }} />
                      ) : (
                        <EyeIcon style={{ width: '20px', height: '20px' }} />
                      )}
                    </span>
                  )}
                </CInputGroup>

                {editPasswordMode &&
                  formData.newPassword &&
                  !isValidPassword(formData.newPassword) && (
                    <span className="text-danger mt-2 d-block">
                      Password must be at least 8 characters and include letters and numbers.
                    </span>
                  )}
              </CCol>

              <CCol md={4}>
                <CFormLabel>Confirm Password</CFormLabel>

                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>

                  <CFormInput
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    maxLength={8}
                    disabled={!editPasswordMode}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </CInputGroup>

                {editPasswordMode &&
                  formData.confirmPassword &&
                  formData.confirmPassword !== formData.newPassword && (
                    <span className="text-danger mt-2 d-block">Passwords do not match.</span>
                  )}
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-3 mt-3">
              {!editPasswordMode ? (
                <CButton
                  color="primary"
                  className="px-4 py-2"
                  onClick={() => setEditPasswordMode(true)}
                >
                  Edit
                </CButton>
              ) : (
                <>
                  <CButton
                    color="secondary"
                    className="px-4 py-2"
                    onClick={() => {
                      setEditPasswordMode(false)
                      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                    }}
                  >
                    Cancel
                  </CButton>

                  <CButton
                    color="success"
                    className="px-4 py-2"
                    onClick={handlePasswordSave}
                    disabled={
                      !formData.oldPassword ||
                      !formData.newPassword ||
                      !formData.confirmPassword ||
                      !isValidPassword(formData.newPassword) ||
                      formData.newPassword !== formData.confirmPassword
                    }
                  >
                    Save
                  </CButton>
                </>
              )}
            </div>
          </CForm>
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default ProfilePage
