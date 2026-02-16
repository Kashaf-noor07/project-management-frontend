import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked } from "@coreui/icons";
import { useParams, useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!password || !confirmPassword) {
    setError(true);
    toast.error("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const result = await res.json();

    if (res.ok) {
  toast.success(result.message || "Password reset successfully!");

  
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  
  setTimeout(() => {
    window.location.replace("/login");
  }, 3000);
  } else {
      toast.error(result.message || "Failed to reset password.");
    }
  } catch (err) {
    toast.error("Error: " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4 shadow-lg border-0">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Reset Password</h1>
                  <p className="text-body-secondary">
                    Enter your new password below.
                  </p>

                  {/* New Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  {error && !password && (
                    <p className="text-danger small">Password is required</p>
                  )}

                  {/* Confirm Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </CInputGroup>
                  {error && !confirmPassword && (
                    <p className="text-danger small">
                      Confirm Password is required
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="d-grid">
                    <CButton color="primary" type="submit" disabled={loading}>
                      {loading ? "Resetting..." : "Reset Password"}
                    </CButton>
                  </div>

                  {/* Message */}
                  {message && (
                    <p className="text-center text-muted mt-3 small">{message}</p>
                  )}
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;
