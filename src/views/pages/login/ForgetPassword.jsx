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
import { cilEnvelopeClosed } from "@coreui/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
     if (res.ok) {
    toast.success(result.message || "Reset link sent successfully!");
   setTimeout(() => navigate("/login"), 2000);
  } else {
    toast.error(result.message || "Failed to send reset link");
  }
} catch (err) {
  toast.error("Network error, try again later.");
}finally {
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
                  <h1>Forgot Password</h1>
                  <p className="text-body-secondary">
                    Enter your registered email to receive a password reset link.
                  </p>

                  {/* Email Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  {error && !email && (
                    <p className="text-danger small">Email is required</p>
                  )}

                  {/* Submit Button */}
                  <div className="d-grid">
                    <CButton color="primary" type="submit" disabled={loading}>
                      {loading ? "Sending..." : "Send Reset Link"}
                    </CButton>
                  </div>

                  {/* Back to Login */}
                  <div className="mt-3 text-center">
                    <p className="mb-0">
                      Remember your password?{" "}
                      <Link
                        to="/login"
                        className="fw-semibold text-primary text-decoration-underline"
                      >
                        Login
                      </Link>
                    </p>
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

export default ForgotPassword;
