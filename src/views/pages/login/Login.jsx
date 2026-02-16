import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { initParticlesEngine } from "@tsparticles/react";




const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
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
      stroke: { width: 0, color: "#1052e0ff" },
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

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle login
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
    setMsg("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

    if (res.ok) {
  setMsg("Login successful!");
  localStorage.setItem("token", data.token);
localStorage.setItem("userId", data.user.id);
  localStorage.setItem("role", data.user.role);
localStorage.setItem("name", data.user?.name || "User");
  setTimeout(() => navigate("/dashboard"), 1200);
}
 else {
        setMsg(data.message || "Invalid credentials");
      }
    } catch (err) {
      setMsg("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="min-vh-100 d-flex flex-row align-items-center position-relative" >
{engineReady && (
<Particles
  id="tsparticles"
  options={particlesOptions}
/>
)}
      <CContainer className="position-relative" style={{ zIndex: 10 }}>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 shadow-lg border-0">
                <CCardBody>
                  <CForm
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    className="needs-validation"
                  >
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign in to your account</p>

                    {/* Email */}
                    <CInputGroup className="mb-3 position-relative">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        feedbackInvalid="Please enter a valid email."
                        tooltipFeedback
                      />
                    </CInputGroup>

                    {/* Password */}
                    <CInputGroup className="mb-4 position-relative has-validation">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        feedbackInvalid="Please enter your password."
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

                    {/* Message */}
                    {msg && (
                      <p
                        className={`text-center small ${
                          msg.includes("success") ? "text-success" : "text-danger"
                        }`}
                      >
                        {msg}
                      </p>
                    )}

                    {/* Buttons */}
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/forget-password">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Right side card */}
              <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Don’t have an account? Create one to access the dashboard.
                    </p>
                    <Link to="/register">
                      <CButton color="light" className="mt-3 " active tabIndex={-1}>
                        Register Now
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;

