import React, { useState } from 'react'
import {
  CModal,
  CModalBody,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CBadge,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { AiOutlineClose } from 'react-icons/ai'

function ClientDetailsPage({ visible, setVisible, clientDetails }) {
  const [activeTab, setActiveTab] = useState('personal')

  if (!clientDetails) return null

  const { client, projects } = clientDetails

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="xl"
      className="client-details-modal"
    >
      <div
        className="position-relative text-white"
        style={{
          background: 'linear-gradient( #3e4449ff, #979797ff, #fafafaff)',
        }}
      >
        {/* --- Close (X) Button --- */}
        <CButton
          className="position-absolute top-0 end-0 m-3 text-white"
          onClick={() => setVisible(false)}
          style={{
            border: 'none',
          }}
        >
          <AiOutlineClose size={20} />
        </CButton>

        {/* --- Header Content --- */}
        <div className="p-4 d-flex align-items-center gap-3">
          <img
            src="https://seasonedmeal.reshortai.com/admin/assets/images/users/dummy.jpg"
            alt="client"
            className="rounded-circle border border-3 border-white"
            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
          />
          <div>
            <h4 className="mb-0 fw-bold text-white">{client.clientName}</h4>
            <p className="mb-0 text-white small">{client.clientEmail}</p>
          </div>
        </div>
      </div>

      {/* ✅ Modal Body */}
      <CModalBody>
        {/* Tabs Navigation */}
        <div className="border-bottom mb-3">
          <CNav variant="pills" role="tablist" className="gap-2">
            <CNavItem>
              <CNavLink
                active={activeTab === 'personal'}
                onClick={() => setActiveTab('personal')}
                className="fw-semibold "
              >
                
                <i className="bi bi-person-lines-fill me-2 "></i>
                Personal Info
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'address'}
                onClick={() => setActiveTab('address')}
                className="fw-semibold"
              >
                <i className="bi bi-geo-alt-fill me-2"></i>
                Address Details
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
                className="fw-semibold"
                style={{ cursor: 'pointer' }}
                role="button"
              >
                <i className="bi bi-diagram-3-fill me-2"></i>
                Project Details
              </CNavLink>
            </CNavItem>
          </CNav>
        </div>

        {/* Tab Content */}
        <CTabContent>
          {/* --- Personal Info --- */}
          <CTabPane visible={activeTab === 'personal'}>
            <CCard className="shadow-sm border-0">
              <CCardBody >
                <h5 className="fw-semibold mb-3 text-secondary">Personal Information</h5>
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="ps-0">Full Name:</th>
                      <td className="text-muted">{client.clientName}</td>
                    </tr>
                    <tr>
                      <th className="ps-0">Email:</th>
                      <td className="text-muted">{client.clientEmail}</td>
                    </tr>
                    <tr>
                      <th className="ps-0">Phone Number:</th>
                      <td className="text-muted">{client.clientNumber}</td>
                    </tr>
                    <tr>
                      <th className="ps-0">Status:</th>
                      <td>
                        {client.isActive ? (
                          <CBadge color="success">Active</CBadge>
                        ) : (
                          <CBadge color="danger">Inactive</CBadge>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CTabPane>
    
          {/* --- Address Details --- */}
          <CTabPane visible={activeTab === 'address'}>
            <CCard className="shadow-sm border-0">
              <CCardBody>
                <h5 className="fw-semibold mb-3 text-secondary">Address Details</h5>
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th className="ps-0">Address:</th>
                      <td className="text-muted">{client.clientAddress}</td>
                    </tr>
                    <tr>
                      <th className="ps-0">City:</th>
                      <td className="text-muted">{client.clientCity}</td>
                    </tr>
                    <tr>
                      <th className="ps-0">State:</th>
                      <td className="text-muted">{client.clientState}</td>
                    </tr>
                    <tr>
                      <th className="ps-0">Zip Code:</th>
                      <td className="text-muted">{client.zipCode}</td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CTabPane>

          {/* --- Project Details --- */}
          <CTabPane visible={activeTab === 'projects'}>
            <CCard className="shadow-sm border-0">
              <CCardBody>
                <h5 className="fw-semibold mb-3 text-secondary">Assigned Projects</h5>
                {projects && projects.length > 0 ? (
                  <CTable hover responsive bordered>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Project Name</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Start Date</CTableHeaderCell>
                        <CTableHeaderCell>Due Date</CTableHeaderCell>
                        <CTableHeaderCell>Budget</CTableHeaderCell>
                        <CTableHeaderCell>Progress</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {projects.map((p, i) => (
                        <CTableRow key={p._id}>
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>{p.projectName}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge
                              color={
                                p.status === 'Completed'
                                  ? 'success'
                                  : p.status === 'Active'
                                    ? 'warning'
                                    : p.status === 'Canceled'
                                      ? 'danger'
                                      : p.status === 'On Hold'
                                        ? 'info'
                                        : 'secondary'
                              }
                            >
                              {p.status}
                            </CBadge>
                          </CTableDataCell>

                          <CTableDataCell>
                            {new Date(p.startDate).toLocaleDateString()}
                          </CTableDataCell>
                          <CTableDataCell>
                            {new Date(p.dueDate).toLocaleDateString()}
                          </CTableDataCell>
                          <CTableDataCell>${p.budget}</CTableDataCell>
                          <CTableDataCell>{p.progress}%</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <p className="text-muted">No projects assigned.</p>
                )}
              </CCardBody>
            </CCard>
          </CTabPane>
        </CTabContent>

        {/* ✅ Bottom Close Button */}
        <div className="text-end mt-4">
          <CButton color="primary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </div>
      </CModalBody>
    </CModal>
  )
}

export default ClientDetailsPage
