import React, { useState } from "react";
import {
  CModal,
  CModalBody,
  CButton,
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
} from "@coreui/react";
import { AiOutlineClose } from "react-icons/ai";
import { FaProjectDiagram, FaTasks, FaUsers } from "react-icons/fa";

function ProjectDetailsPage({ visible, setVisible, details }) {
  const [activeTab, setActiveTab] = useState("info");
  const { project, tasks } = details || {};

  if (!project) return null;

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
      alignment="center"
      className="project-details-modal"
    >
      {/* 🌆 Custom Header */}
      <div
        className="position-relative text-white"
        style={{
        background: "linear-gradient( #3e4449ff, #979797ff, #fafafaff)", 
        }}
      >
        {/* ❌ Close Button */}
        <CButton
          className="position-absolute top-0 end-0 m-3 text-white"
          onClick={() => setVisible(false)}
          style={{
            border: "none",
          }}
        >
          <AiOutlineClose size={20} />
        </CButton>

        {/* 🔖 Header Content */}
        <div className="p-4 d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-white d-flex align-items-center justify-content-center"
            style={{ width: "70px", height: "70px" }}
          >
            <FaProjectDiagram size={35} className="text-secondary" />
          </div>

          <div>
            <h4 className="mb-0 fw-bold text-white">{project.projectName}</h4>
            <p className="mb-0 text-white small">{project.clientId?.clientName}</p>
          
          </div>
        </div>
      </div>

      {/* 📋 Modal Body */}
      <CModalBody>
        {/* 🧭 Tabs Navigation */}
        <div className="border-bottom mb-3">
          <CNav variant="pills" role="tablist" className="gap-2">
            <CNavItem>
              <CNavLink
                active={activeTab === "info"}
                onClick={() => setActiveTab("info")}
                className="fw-semibold"
              >
                <FaProjectDiagram className="me-2" />
                Project Info
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeTab === "team"}
                onClick={() => setActiveTab("team")}
                className="fw-semibold"
              >
                <FaUsers className="me-2" />
                Team Members
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeTab === "tasks"}
                onClick={() => setActiveTab("tasks")}
                className="fw-semibold"
              >
                <FaTasks className="me-2" />
                Tasks
              </CNavLink>
            </CNavItem>
          </CNav>
        </div>

        {/* 🧱 Tabs Content */}
        <CTabContent>
        
          <CTabPane visible={activeTab === "info"}>
            <CCard className="shadow-sm border-0">
              <CCardBody>
                <h5 className="fw-semibold mb-3 text-secondary">Project Details</h5>
                <table className="table table-borderless mb-0">
                  <tbody>
                    <tr>
                      <th  className="ps-0 text-dark fw-semibold" >Project Name:</th>
                      <td className="text-muted">{project.projectName}</td>
                    </tr>
                    <tr>
                      <th className="ps-0 text-dark fw-semibold">Client:</th>
                      <td className="text-muted">
                        {project.clientId?.clientName} ({project.clientId?.clientEmail})
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-0 text-dark fw-semibold">Description:</th>
                      <td className="text-muted">{project.description || "N/A"}</td>
                    </tr>
                    <tr>
                      <th className="ps-0 text-dark fw-semibold">Start Date:</th>
                      <td className="text-muted">
                        {new Date(project.startDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-0 text-dark fw-semibold">Due Date:</th>
                      <td className="text-muted">
                        {new Date(project.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-0 text-dark fw-semibold">Budget:</th>
                      <td className="text-muted">${project.budget}</td>
                    </tr>
                    <tr>
                      <th className="ps-0 text-dark fw-semibold">Progress:</th>
                      <td className="text-muted">{project.progress}%</td>
                    </tr>
                    <tr>
                      <th className="ps-0 text-dark fw-semibold">Status:</th>
                      <td>  <span
                      className={`px-3 py-2 rounded-pill badge ${
                        project.status === 'Completed'
                          ? 'bg-success'
                          : project.status === 'Active'
                            ? 'bg-warning'
                          : project.status === 'Canceled'
                            ? 'bg-danger'
                            : project.status === 'On Hold'
                              ? 'bg-info'
                              : 'bg-dark'
                      }`}
                    > 
                      {project.status}
                    </span></td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CTabPane>

          {/* 👥 Team Members */}
          <CTabPane visible={activeTab === "team"}>
  <CCard className="shadow-sm border-0">
    <CCardBody>
      <h5 className="fw-bold mb-4 text-primary">Assigned Team Members</h5>

      {project.assignedMembers?.length ? (
        <ul className="list-group list-group-flush">
          {project.assignedMembers.map((m) => (
            <li
              key={m._id}
              className="list-group-item d-flex align-items-center gap-2"
            >
           
              <div
                className="rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "#eef2ff",
                  fontWeight: "bold",
                  color: "#4f46e5",
                  fontSize: "18px",
                }}
              >
                {m.name?.charAt(0).toUpperCase()}
              </div>

              {/* Member Info */}
              <div>
                <div className="fw-semibold">{m.name}</div>
                <div className="text-muted small">{m.email}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted mb-0">No members assigned to this project.</p>
      )}
    </CCardBody>
  </CCard>
</CTabPane>


          {/* ✅ Tasks */}
          <CTabPane visible={activeTab === "tasks"}>
            <CCard className="shadow-sm border-0">
              <CCardBody>
                <h5 className="fw-semibold mb-3 text-secondary">Tasks for This Project</h5>
                {tasks?.length ? (
                  <CTable hover responsive bordered>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Title</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Priority</CTableHeaderCell>
                        <CTableHeaderCell>Due Date</CTableHeaderCell>
                        <CTableHeaderCell>Assigned To</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {tasks.map((task, index) => (
                        <CTableRow key={task._id}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{task.title}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge
                              color={
                                task.status === "Done"
                                  ? "success"
                                  : task.status === "In Progress"
                                  ? "info"
                                  : task.status === "In Review"
                                  ? "warning"
                                  : "secondary"
                              }
                                className="p-2 rounded-pill"
                            >
                              {task.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{task.priority}</CTableDataCell>
                          <CTableDataCell>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </CTableDataCell>
                          <CTableDataCell>
                            {task.assignedTo?.length
                              ? task.assignedTo.map((u) => u.name).join(", ")
                              : "Unassigned"}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <p className="text-muted mb-0">No tasks found for this project.</p>
                )}
              </CCardBody>
            </CCard>
          </CTabPane>
        </CTabContent>

        {/* 🚪 Close Button */}
        <div className="text-end mt-4">
          <CButton color="primary" onClick={() => setVisible(false)}>
           Close
          </CButton>
        </div>
      </CModalBody>
    </CModal>
  );
}

export default ProjectDetailsPage;
