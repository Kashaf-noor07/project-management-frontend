import React, { useEffect, useState } from "react";
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
  CFormFeedback,
} from "@coreui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSpinner, FaSave, FaEdit } from "react-icons/fa"
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_URL = import.meta.env.VITE_API_URL;

const AddClientForm = ({
  existingClient = null,
  isEditMode = false,
  setVisible,
  fetchClients,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: "",
    clientNumber: "",
    clientEmail: "",
    clientPassword: "",
    clientAddress: "",
    clientState: "",
    clientCity: "",
    zipCode: "",
  });

  const [validated, setValidated] = useState(false); 
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingClient) {
      setFormData({
        clientName: existingClient.clientName || "",
        clientNumber: existingClient.clientNumber || "",
        clientEmail: existingClient.clientEmail || "",
        clientPassword: existingClient.clientPassword || "",
        clientAddress: existingClient.clientAddress || "",
        clientState: existingClient.clientState || "",
        clientCity: existingClient.clientCity || "",
        zipCode: existingClient.zipCode || "",
      });
    }
  }, [existingClient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (title, message) => {
    setToast(
      <CToast animation={false} autohide={false} visible={true}>
        <CToastHeader closeButton>
          <svg
            className="rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill="#007aff"></rect>
          </svg>
          <div className="fw-bold me-auto">{title}</div>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // ✅ Built-in CoreUI validation handling
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (isEditMode && existingClient?._id) {
        await axios.put(
          `${API_URL}/client/update-client/${existingClient._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Client updated successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        if (fetchClients) fetchClients();
        setVisible(false);
      } else {
        await axios.post(`${API_URL}/client/add-client`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Client added successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });

        
    
    setValidated(false);

  
    setFormData({
      clientName: "",
      clientNumber: "",
      clientEmail: "",
      clientPassword: "",
      clientAddress: "",
      clientState: "",
      clientCity: "",
      zipCode: "",
    });
        setTimeout(() => navigate("/clients"), 3000);
      }

      if (!isEditMode) {
        setFormData({
          clientName: "",
          clientNumber: "",
          clientEmail: "",
          clientPassword: "",
          clientAddress: "",
          clientState: "",
          clientCity: "",
          zipCode: "",
        });
      }
    } catch (err) {
      console.error(err);
      showToast(
        "Error",
        err.response?.data?.message || "Something went wrong. Try again.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CCard className="shadow-sm border-0">
        <CCardHeader>
          <h4 className="fw-bold mb-0">
            {isEditMode ? "Update Client" : "Add Client"}
          </h4>
        </CCardHeader>

        <CCardBody>
          <CForm
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="needs-validation"
          >
            
           <fieldset className="border p-3 mb-3 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-person-lines-fill"></i>
    Personal Details
  </legend>

 <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Full Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="clientName"
                  placeholder="Enter full name"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please provide a valid name."
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Phone Number</CFormLabel>
                <CFormInput
                  type="text"
                  name="clientNumber"
                  placeholder="Enter phone number"
                  value={formData.clientNumber}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please provide a valid phone number."
                />
              </CCol>
            </CRow>

    
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="clientEmail"
                  placeholder="Enter email"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  required
                  feedbackInvalid="Please provide a valid email."
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Password</CFormLabel>
                <CFormInput
                  type="password"
                  name="clientPassword"
                  placeholder={
                    isEditMode
                      ? "Password cannot be changed"
                      : "Enter password"
                  }
                  value={formData.clientPassword}
                  onChange={handleChange}
                  disabled={isEditMode}
                  required={!isEditMode}
                  feedbackInvalid="Please provide a password."
                  style={{
                    cursor: isEditMode ? "not-allowed" : "text",
                    borderColor: isEditMode ? "red" : "",
                    backgroundColor: isEditMode ? "#f8d7da" : "",
                  }}
                />
              </CCol>
            </CRow>
</fieldset>

            

           <fieldset className="border p-3 mb-4 rounded">
  <legend className="float-none w-auto px-2 text-primary fs-6 fw-semibold d-flex align-items-center gap-1">
    <i className="bi bi-geo-alt-fill"></i>
    Address Details
  </legend>

  <CRow className="mb-3">
    <CCol md={6}>
      <CFormLabel>
        Address <span className="text-danger">*</span>
      </CFormLabel>
      <CFormTextarea
        rows={1}
        name="clientAddress"
        placeholder="Enter full address"
        value={formData.clientAddress}
        onChange={handleChange}
        required
        feedbackInvalid="Please provide a valid address."
      />
    </CCol>

    <CCol md={6}>
      <CFormLabel>
        State <span className="text-danger">*</span>
      </CFormLabel>
      <CFormInput
        type="text"
        name="clientState"
        placeholder="Enter state"
        value={formData.clientState}
        onChange={handleChange}
        required
        feedbackInvalid="Please provide a valid state."
      />
    </CCol>
  </CRow>

  <CRow>
    <CCol md={6}>
      <CFormLabel>
        City <span className="text-danger">*</span>
      </CFormLabel>
      <CFormInput
        type="text"
        name="clientCity"
        placeholder="Enter city"
        value={formData.clientCity}
        onChange={handleChange}
        required
        feedbackInvalid="Please provide a valid city."
      />
    </CCol>

    <CCol md={6}>
      <CFormLabel>
        Zip Code <span className="text-danger">*</span>
      </CFormLabel>
      <CFormInput
        type="text"
        name="zipCode"
        placeholder="Enter zip code"
        value={formData.zipCode}
        onChange={handleChange}
        required
        feedbackInvalid="Please provide a valid zip code."
      />
    </CCol>
  </CRow>
</fieldset>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <CButton
            
                type="button"
                color="secondary"
                onClick={() => {
                  if (setVisible) setVisible(false)
                  else navigate('/clients')
                }}
              >
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
      Update Client
    </>
  ) : (
    <>
     <FaSave className="me-2" />
      Save Client
    </>
  )}
</CButton>

            </div>
          </CForm>
        </CCardBody>
      </CCard>

      <CToaster placement="top-end">{toast}</CToaster>
    </>
  );
};

export default AddClientForm;
