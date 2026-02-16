import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CSpinner,
} from "@coreui/react";
import { FaEdit, FaTrash, FaComment,FaQuestion, FaEye, FaPen } from "react-icons/fa";
import Swal from "sweetalert2";
import AddTaskForm from "./AddTaskForm";
import TaskDetailsPage from "./TaskDetailsPage"
import CommentModalQuery from "./CommentModalQuery";

function TaskTable({ searchTerm}) {
  const [tasks, setTasks] = useState([]);
 const [showCommentModal, setShowCommentModal] = useState(false);
const [commentTask, setCommentTask] = useState(null);


  const [visible, setVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [taskDetails, setTaskDetails] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL;
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


// Filter tasks based on search term
const filteredTasks = tasks.filter((task) => {
  const search = searchTerm.toLowerCase();

  const title = task.title?.toLowerCase() || "";
  const projectName = task.projectId?.projectName?.toLowerCase() || "";
  const assignedTo = task.assignedTo
    ?.map((m) => m.name.toLowerCase())
    .join(", ") || "";
  const status = task.status?.toLowerCase() || "";
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString().toLowerCase()
    : "";

  return [title, projectName, assignedTo, status, dueDate].some((field) =>
    field.includes(searchTerm)
  );
});





  // ✅ Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/task/task-table`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🗑️ Delete Task
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0c66b6ff",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/task/delete-task/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "Task has been deleted.", "success");
        fetchTasks();
      } catch (err) {
        Swal.fire("Error", "Failed to delete task.", "error");
        console.error("Error deleting task:", err);
      }
    }
  };

    // 📋 Show Project Details
  const handleShowDetails = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/task/task-details/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskDetails(res.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching task details:", error);
      Swal.fire("Error", "Failed to load task details", "error");
    }
  };
//shoe comment modal 
const handleComment = (task) => {
  setCommentTask(task);
  setShowCommentModal(true);
};


  // ✏️ Edit Task
  const handleEdit = (task) => {
    setSelectedTask(task);
    setVisible(true);
  };

  // 🧱 Define DataTable Columns
  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "70px",
      center: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Project",
      selector: (row) => row.projectId?.projectName || "—",
      sortable: true,
      center: true,
    },
    {
      name: "Assigned To",
      selector: (row) =>
        row.assignedTo && row.assignedTo.length > 0
          ? row.assignedTo.map((m) => m.name).join(", ")
          : "—",
      wrap: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => (
        <span
          className={`badge ${
            row.status === "Done"
              ? "bg-success"
              : row.status === "In Progress"
              ? "bg-warning"
              : row.status === "In Review"
              ? "bg-info"
              : "bg-secondary"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Due Date",
      selector: (row) => new Date(row.dueDate).toLocaleDateString(),
      sortable: true,
      center: true,
    },
    
 {
  name: "Action",
  center: true,
  width: "130px",
  cell: (row) => (
    <div className="d-flex justify-content-center align-items-center gap-3">
      
      <FaEye
        title="View Details"
        className="text-success"
        style={{ cursor: "pointer", fontSize: "1rem" }}
        onClick={() => handleShowDetails(row._id)}
      />


      <FaPen
        title="Edit Tasks"
        className="text-primary"
        style={{ cursor: "pointer", fontSize: "1rem" }}
        onClick={() => handleEdit(row)}
      />
     <FaComment
  title="Query Section"
  className="text-primary"
  style={{ cursor: "pointer", fontSize: "1rem" }}
  onClick={() => handleComment(row)}
/>

{ role === "admin" && (
     <FaTrash
        title="Delete Tasks"
        className="text-danger"
        style={{ cursor: "pointer", fontSize: "1rem" }}
        onClick={() => handleDelete(row._id)}
      />
)}
   
    
    </div>
  ),
},

  ];

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner variant="grow" color="primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredTasks}
                  customStyles={customStyles}
              pagination
         paginationPerPage={10}
          paginationRowsPerPageOptions={[ 10, 20,30]}
  persistTableHead
          highlightOnHover
          striped
          responsive
           noDataComponent="No tasks found"
        />
      )}

    
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Task</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <AddTaskForm
            existingTask={selectedTask}
            isEditMode={true}
            fetchTasks={fetchTasks}
            setVisible={setVisible}
          />
        </CModalBody>
      </CModal>

     {taskDetails && (
        <TaskDetailsPage
          visible={showDetailsModal}
          setVisible={setShowDetailsModal}
          task={taskDetails}   
        />
      )}
      {showCommentModal && (
  <CommentModalQuery
    visible={showCommentModal}
    setVisible={setShowCommentModal}
    task={commentTask}
  />
)}


    </>
  );
}

export default TaskTable;
