import React, { useState,useEffect } from 'react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CFormInput, CButton } from '@coreui/react'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

function CommentModalQuery({ visible, setVisible, task }) {
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState(task?.comments || [])

  const token = localStorage.getItem('token')
  const userName = localStorage.getItem('name')
 const loggedInUser = localStorage.getItem("userId");
 
const capitalizeFirstLetter = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};



  // Send new comment
  const handleSend = async () => {
    if (!newComment.trim()) return

    try {
      const res = await axios.post(
        `${API_URL}/task/add-comment/${task._id}`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setComments((prev) => [...prev, res.data.comment])

      setNewComment('')
      console.log("loggedInUser:", loggedInUser)
console.log("comment userId:", task.comments.map(c => c.userId))

    } catch (err) {
      console.error('Error sending comment:', err)
    }
  }

  return (
    <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
      <CModalHeader>
     <CModalTitle>
  Query Section – <span className="text-primary fw-bold">{task?.title}</span>
</CModalTitle>


      </CModalHeader>

      <CModalBody>
  <div
  className="mb-3 p-3 border rounded"
  style={{ maxHeight: "350px", overflowY: "auto", background: "#f7f7f7" }}
>
  {comments.length === 0 && (
    <p className="text-muted text-center">No queries yet.</p>
  )}

  {comments.map((c, idx) => {
   
const senderId =
  typeof c.userId === "object" ? c.userId?._id : c.userId;

const isSender = senderId === localStorage.getItem("userId");


    return (
      <div
        key={idx}
        className={`d-flex mb-3 ${
          isSender ? "justify-content-end" : "justify-content-start"
        }`}
      >
        <div
          className="p-2 px-3 rounded-4 shadow-sm"
          style={{
            maxWidth: "70%",
            background: isSender ? "#0d6efd" : "#ffffff",
            color: isSender ? "white" : "black",
            border: isSender ? "none" : "1px solid #ddd",
          }}
        >
          {!isSender && (
            <div className="fw-bold small mb-1 text-primary text-capitalize">
                
            {c.userId?.name || c.userName || "Unknown User"}

            </div>
          )}

          <div className="mb-1">{c.comment}</div>

          <div
            className="text-end small "
            style={{ opacity: 0.7, fontSize: "11px" }}
          >
            {new Date(c.createdAt).toLocaleString()}
            
          </div>
        </div>
      </div>
    );
  })}
</div>




        {/* INPUT */}
      <div className="d-flex gap-2 mt-2">
  <CFormInput
    placeholder="Type your comment..."
    value={newComment}
  onChange={(e) => setNewComment(capitalizeFirstLetter(e.target.value))}
    className="shadow-sm"
  />
  <CButton color="primary" className="px-4" onClick={handleSend}>
    Send
  </CButton>
</div>

      </CModalBody>
    </CModal>
  )
}

export default CommentModalQuery

