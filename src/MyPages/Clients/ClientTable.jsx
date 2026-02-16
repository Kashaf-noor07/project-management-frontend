import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CSpinner,
  CFormSwitch,
} from "@coreui/react";
import { FaEdit, FaTrash, FaEye, FaPen } from "react-icons/fa";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import AddClientForm from "./AddClientForm";
import ClientDetailsPage from "./ClientDetailsPage";

function ClientTable({ searchTerm }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;


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






  // Filter clients based on search term
  const filteredClients = clients.filter((client) =>
    [client.clientName, client.clientEmail, client.clientNumber]
      .some((field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/client/client-table`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Delete client
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0c66b6ff",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/client/delete-client/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "Client has been deleted.", "success");
        fetchClients();
      } catch (err) {
        Swal.fire("Error", "Failed to delete client.", "error");
        console.error("Error deleting client:", err);
      }
    }
  };

  // Toggle client status
  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/client/toggle-client/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients();
    } catch (err) {
      console.error("Error toggling client status:", err);
    }
  };

  // Show client details
  const handleShowDetails = async (clientId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/client/client-details/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientDetails(res.data);
      setDetailsVisible(true);
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  // Edit client
  const handleEdit = (client) => {
    setSelectedClient(client);
    setVisible(true);
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      width: "70px",
      sortable: true,
      center: true,
    },
    {
      name: "Name",
      selector: (row) => row.clientName,
      sortable: true,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.clientEmail,
      sortable: true,
      center: true,
    },
    {
      name: "Number",
      selector: (row) => row.clientNumber,
      center: true,
    },
    {
      name: "Client Status",
      cell: (row) => (
        <div className="d-flex align-items-center justify-content-center gap-2 w-100">
          <CFormSwitch
            color="primary"
            checked={!!row.isActive}
            onChange={() => handleToggleStatus(row._id)}
            style={{ transform: "scale(0.9)" }}
          />
          <span className={`fw-semibold ${row.isActive ? "text-success" : "text-danger"}`}>
            {row.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      center: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex justify-content-center align-items-center gap-3">
          <FaEye
            title="View Details"
            className="text-success"
            style={{ cursor: "pointer", fontSize: "1rem" }}
            onClick={() => handleShowDetails(row._id)}
          />
          <FaPen
            title="Edit Client"
            className="text-primary"
            style={{ cursor: "pointer", fontSize: "1rem" }}
            onClick={() => handleEdit(row)}
          />
          <FaTrash
            title="Delete Client"
            className="text-danger"
            style={{ cursor: "pointer", fontSize: "1rem" }}
            onClick={() => handleDelete(row._id)}
          />
        </div>
      ),
      center: true,
    },
  ];

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <CSpinner color="primary" variant="grow" />
        </div>
      ) : (
        <div className="table-responsive shadow-sm border rounded">
          <DataTable
            columns={columns}
            data={filteredClients}
             customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[ 10, 20,30]}
            highlightOnHover
            striped
            responsive
            persistTableHead
            noDataComponent="No clients found"
          />
        </div>
      )}

      {/* Edit Client Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Edit Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <AddClientForm
            existingClient={selectedClient}
            isEditMode={true}
            fetchClients={fetchClients}
            setVisible={setVisible}
          />
        </CModalBody>
      </CModal>

      {/* Client Details Modal */}
      <ClientDetailsPage
        visible={detailsVisible}
        setVisible={setDetailsVisible}
        clientDetails={clientDetails}
      />
    </>
  );
}

export default ClientTable;
