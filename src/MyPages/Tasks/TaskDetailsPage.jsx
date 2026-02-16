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
import { FaTasks, FaCalendarAlt, FaUsers, FaCommentDots, FaPaperclip } from "react-icons/fa";
import TaskImageCrousal from './TaskImageCrousal'

function TaskDetailsPage({ visible, setVisible, task }) {
   const [activeTab, setActiveTab] = useState("info");
   const [carouselVisible, setCarouselVisible] = useState(false);
const [carouselAttachments, setCarouselAttachments] = useState([]);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


  if (!task) return null;
  return (
   

       <CModal visible={visible} onClose={() => setVisible(false)} size="lg" alignment="center">
 
      <div
        className="position-relative text-white"
        style={{
        background: "linear-gradient( #3e4449ff, #8a8888ff, #fafafaff)", 
        }}
      >
        <CButton
          className="position-absolute top-0 end-0 m-3 text-white"
          onClick={() => setVisible(false)}
          style={{ border: "none" }}
        >
          <AiOutlineClose size={20} />
        </CButton>

        <div className="p-4 d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-white d-flex align-items-center justify-content-center"
            style={{ width: "65px", height: "65px" }}
          >
            <FaTasks size={30} className="text-secondary" />
          </div>

          <div>
            <h4 className="mb-0 fw-bold text-white">{task.title}</h4>
            <p className="mb-0 text-light small">
              {task.projectId?.projectName || "No Project"}
            </p>
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
                <FaTasks className="me-2" /> Task Info
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeTab === "deadline"}
                onClick={() => setActiveTab("deadline")}
                className="fw-semibold"
              >
                <FaCalendarAlt className="me-2" /> Deadline
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                active={activeTab === "members"}
                onClick={() => setActiveTab("members")}
                className="fw-semibold"
              >
                <FaUsers className="me-2" /> Members
              </CNavLink>
            </CNavItem>

            {task.comments?.length > 0 && (
              <CNavItem>
                <CNavLink
                  active={activeTab === "comments"}
                  onClick={() => setActiveTab("comments")}
                  className="fw-semibold"
                >
                  <FaCommentDots className="me-2" /> Comments
                </CNavLink>
              </CNavItem>
            )}
          </CNav>
        </div>

        {/* 🧱 Tabs Content */}
       <CTabContent>

  {/* 🧾 Task Info */}
  <CTabPane visible={activeTab === "info"}>
    <CCard className="border-0 shadow-sm">
      <CCardBody>
        <h5 className="fw-bold mb-4 text-primary">Task Overview</h5>

        <table className="table table-borderless align-middle">
          <tbody>

            <tr>
              <th className="ps-0 text-dark fw-semibold" style={{ width: "180px" }}>
                Title:
              </th>
              <td className="text-muted">{task.title}</td>
            </tr>

            <tr>
              <th className="ps-0 text-dark fw-semibold"> Project:</th>
              <td className="text-muted">{task.projectId?.projectName || "—"}</td>
            </tr>

            <tr>
              <th className="ps-0 text-dark fw-semibold"> Description:</th>
              <td className="text-muted">{task.description || "No description available."}</td>
            </tr>

            <tr>
              <th className="ps-0 text-dark fw-semibold"> Status:</th>
              <td>
                <CBadge
                  color={
                    task.status === "Done"
                      ? "success"
                      : task.status === "In Progress"
                      ? "warning"
                      : task.status === "In Review"
                      ? "info"
                      : "secondary"
                  }
                  className="px-3 py-2 rounded-pill"
                >
                  {task.status}
                </CBadge>
              </td>
            </tr>

            <tr>
              <th className="ps-0 text-dark fw-semibold"> Priority:</th>
              <td>
                <CBadge
                  color={
                    task.priority === "High"
                      ? "danger"
                      : task.priority === "Medium"
                      ? "warning"
                      : "success"
                  }
                  className="px-3 py-2 rounded-pill"
                >
                  {task.priority}
                </CBadge>
              </td>
            </tr>

            {/* Attachments */}
            <tr>
              <th className="ps-0 text-dark fw-semibold">📎 Attachments:</th>
              <td>
                {task.attachments?.length ? (
                  <div className="d-flex align-items-center gap-2 flex-wrap">

                    {/* Preview first 2 files */}
                    {task.attachments.slice(0, 2).map((file, i) => {
                      const fileUrl = `${API_URL}/uploads/tasks/${file}`
                      const fileName = file.split("/").pop().toLowerCase()

                      const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(fileName)
                      const isVideo = /\.(mp4|webm|ogg)$/i.test(fileName)
                      const isPDF   = /\.pdf$/i.test(fileName)

                      return (
                        <div
                          key={i}
                          onClick={() => {
                            setCarouselAttachments(task.attachments)
                            setCarouselVisible(true)
                          }}
                          style={{
                            width: "60px",
                            height: "60px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid #ddd",
                          }}
                        >
                          {isImage && (
                            <img
                              src={fileUrl}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          )}

                          {isVideo && (
                            <div className="d-flex justify-content-center align-items-center h-100 bg-light">
                              
                            </div>
                          )}

                          {isPDF && (
                            <div className="d-flex justify-content-center align-items-center h-100 bg-light">
                              
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Extra Count */}
                    {task.attachments.length > 2 && (
                      <span className="text-muted small">
                        +{task.attachments.length - 2} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted">No attachments</span>
                )}
              </td>
            </tr>

          </tbody>
        </table>
      </CCardBody>
    </CCard>
  </CTabPane>

  {/* ⏰ Deadlines */}
  <CTabPane visible={activeTab === "deadline"}>
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h5 className="fw-bold mb-4 text-primary">Task Timeline</h5>

        <table className="table table-borderless">
          <tbody>
            <tr>
              <th className="ps-0 fw-semibold text-dark">📅 Start Date:</th>
              <td className="text-muted">{new Date(task.startDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th className="ps-0 fw-semibold text-dark">⏳ Due Date:</th>
              <td className="text-muted">{new Date(task.dueDate).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </CCardBody>
    </CCard>
  </CTabPane>

  {/* 👥 Members */}
  <CTabPane visible={activeTab === "members"}>
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h5 className="fw-bold mb-4 text-primary">Assigned Members</h5>

        {task.assignedTo?.length ? (
          <ul className="list-group list-group-flush">
            {task.assignedTo.map((user) => (
              <li key={user._id} className="list-group-item d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "42px",
                    height: "42px",
                    background: "#eef2ff",
                    fontWeight: "bold",
                    color: "#4f46e5",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="fw-semibold">{user.name}</div>
                  <div className="text-muted small">{user.email}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No members assigned.</p>
        )}
      </CCardBody>
    </CCard>
  </CTabPane>

  {/* 💬 Comments */}
  <CTabPane visible={activeTab === "comments"}>
    <CCard className="shadow-sm border-0">
      <CCardBody>
        <h5 className="fw-bold mb-4 text-primary">Comments</h5>

        {task.comments?.length ? (
          <CTable  responsive>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>User</CTableHeaderCell>
                <CTableHeaderCell>Comment</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {task.comments.map((c, i) => (
                <CTableRow key={i}>
                  <CTableDataCell className="fw-semibold">
                    {c.userId?.name || "Unknown"}
                  </CTableDataCell>

                  <CTableDataCell>{c.comment}</CTableDataCell>

                  <CTableDataCell className="text-muted small">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p className="text-muted">No comments yet.</p>
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

      <TaskImageCrousal
  visible={carouselVisible}
  setVisible={setCarouselVisible}
  attachments={carouselAttachments}
  apiUrl={API_URL}
/>

    </CModal>
  );
}

export default TaskDetailsPage;
