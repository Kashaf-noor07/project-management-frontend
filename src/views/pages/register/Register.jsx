import React, { useState, useEffect } from "react";
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
import { cilLockLocked, cilUser } from "@coreui/icons";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { initParticlesEngine } from "@tsparticles/react";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
const [engineReady, setEngineReady] = useState(false);


const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800, 
      },
    },
    color: { value: "#1052e0ff" },
    shape: {
      type: "circle",
      stroke: { width: 0, color:"#1052e0ff" },
      polygon: { sides: 5 },
    },
    opacity: {
      value: 0.5,
      random: false,
    },
    size: {
      value: 3,
      random: true,
    },
    links: {
      enable: true,
      distance: 150,
      color:"#1052e0ff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 3,
      direction: "none",
      random: false,
      straight: false,
      outModes: { default: "out" },
      bounce: false,
    },
  },

  interactivity: {
    detect_on: "canvas",
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      grab: { distance: 400 },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: { distance: 200, duration: 0.4 },
      push: { quantity: 4 },
      remove: { quantity: 2 },
    },
  },

  retina_detect: true,
  background: { color: "transparent" },
};

useEffect(() => {
  initParticlesEngine(async (engine) => {
    console.log("Engine received:", engine);

    try {
      await loadSlim(engine);
      console.log("Slim loaded successfully!");
      setEngineReady(true);   
    } catch (err) {
      console.error("loadSlim FAILED:", err);
 
    }
  }).catch((err) => {
    console.error("initParticlesEngine ERROR:", err);
    
  });
}, []);


//password validation 
  const isValidPassword = (password) => {
 
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return regex.test(password)
}

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      setMessage(result.message || result.error);
      if (result.message && result.message.includes("User registered successfully")) {
        navigate("/login");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center position-relative">
     {engineReady && (
     <Particles
       id="tsparticles"
       options={particlesOptions}
     />
     )}
     
      <CContainer className="position-relative" style={{ zIndex: 10 }} >
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4 shadow-lg border-0">
              <CCardBody className="p-4">
                <CForm
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                  className="needs-validation"
                >
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  {/* Name */}
                  <CInputGroup className="mb-3 position-relative">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="name"
                      placeholder="Username"
                      autoComplete="username"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please enter your name."
                      tooltipFeedback
                       style={{ textTransform: "capitalize" }}
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3 position-relative">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      type="email"
                      feedbackInvalid="Please provide a valid email."
                      tooltipFeedback
                    />
                  </CInputGroup>

                {/* Password */}
<CInputGroup className="mb-3 position-relative has-validation">
  <CInputGroupText>
    <CIcon icon={cilLockLocked} />
  </CInputGroupText>

  <CFormInput
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    autoComplete="new-password"
    value={formData.password}
    onChange={handleChange}
    required
    feedbackInvalid="Please enter a password."
    tooltipFeedback
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      background: "none",
      border: "none",
      position: "absolute",
      right: "10px",
      top: "8px",
      color: "#6b7280",
    }}
  >
    {showPassword ? (
      <EyeSlashIcon className="h-5 w-5" />
    ) : (
      <EyeIcon className="h-5 w-5" />
    )}
  </button>
</CInputGroup>

{/* Validation message */}
{formData.password && !isValidPassword(formData.password) && (
  <span className="text-danger mt-1 d-block">
    Password must be at least 8 characters and include letters and numbers.
  </span>
)}


                  {/* Submit Button */}
                  <div className="d-grid">
                    <CButton color="primary" type="submit" disabled={loading}>
                      {loading ? "Creating Account..." : "Create Account"}
                    </CButton>
                  </div>

                  <div className="mt-2 text-center">
                    <p className="mb-0">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="fw-semibold text-primary text-decoration-underline"
                      >
                        Log in
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

export default Register;
