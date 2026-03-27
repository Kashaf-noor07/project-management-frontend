import React, { useState , useEffect} from "react";
import {
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CFormLabel,
  CRow,
  CCol,
} from "@coreui/react";
import { FaSave, FaEdit, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useSettings } from "../../Context/SettingContext";

function SettingPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const { settings, updateSettings } = useSettings();


  const [editMode, setEditMode] = useState(false);
  // const [editData, setEditData] = useState(settings);
  const [files, setFiles] = useState({});
  const [editData, setEditData] = useState({ websiteTitle: "" });

useEffect(() => {
  if (settings) {
    setEditData(settings);
  }
}, [settings]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files: fileInput } = e.target;

    if (fileInput) {
      setFiles({ ...files, [name]: fileInput[0] });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditData(settings);
    setFiles({});
    setEditMode(false);
  };

  // Save settings
  const handleSave = async () => {
    const form = new FormData();
    form.append("websiteTitle", editData.websiteTitle);

    if (files.favicon) form.append("favicon", files.favicon);
    if (files.sidebarLogo) form.append("sidebarLogo", files.sidebarLogo);
    if (files.sidebarLogoSmall) form.append("sidebarLogoSmall", files.sidebarLogoSmall);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API_URL}/setting/update-setting`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Settings Updated!",
        text: res.data.message,
        timer: 1600,
        showConfirmButton: false,
      });

     
      updateSettings(res.data.data);

      setEditMode(false);
      setFiles({});
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Please try again.",
      });
    }
  };

  const isDisabled =
    JSON.stringify(settings) === JSON.stringify(editData) &&
    Object.keys(files).length === 0;

  return (
    <CCard className="p-4 shadow-sm border-0" style={{ borderRadius: "18px" }}>
      <h4 className="fw-bold mb-4">Website Settings</h4>

      <CCardBody>
        <CRow className="mb-3">

     
          <CCol md={4}>
            <CFormLabel className="fw-semibold">Website Title</CFormLabel>
            <CFormInput
              type="text"
              name="websiteTitle"
              value={editData?.websiteTitle || ""}
              disabled={!editMode}
              onChange={handleChange}
            />
          </CCol>

    
          <CCol md={4}>
            <CFormLabel className="fw-semibold">Favicon</CFormLabel>
            <CFormInput
              type="file"
              name="favicon"
              disabled={!editMode}
              onChange={handleChange}
            />

            {settings.favicon && (
              <img
                src={`${API_URL}/${settings.favicon}`}
                alt="favicon"
                height="45"
                className="mt-2 rounded shadow-sm p-1 bg-light"
              />
            )}
          </CCol>

         
          <CCol md={4}>
            <CFormLabel className="fw-semibold">Sidebar Logo</CFormLabel>
            <CFormInput
              type="file"
              name="sidebarLogo"
              disabled={!editMode}
              onChange={handleChange}
            />

            {settings.sidebarLogo && (
              <img
                src={`${API_URL}/${settings.sidebarLogo}`}
                alt="sidebar logo"
                height="60"
                className="mt-2"
              />
            )}
          </CCol>

         
        </CRow>

        {/* BUTTONS */}
        <div className="d-flex justify-content-end gap-3 mt-4">
          {!editMode ? (
            <CButton color="primary" onClick={() => setEditMode(true)}>
              <FaEdit className="me-2" />
              Edit Settings
            </CButton>
          ) : (
            <>
              <CButton color="secondary" onClick={handleCancel}>
                <FaTimes className="me-1" />
                Cancel
              </CButton>

              <CButton
                color="success"
                disabled={isDisabled}
                onClick={handleSave}
                className="text-white"
              >
                <FaSave className="me-2" />
                Save Settings
              </CButton>
            </>
          )}
        </div>
      </CCardBody>
    </CCard>
  );
}

export default SettingPage;
