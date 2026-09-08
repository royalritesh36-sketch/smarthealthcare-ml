import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Brain,
  Activity,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/Auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      const data = response.data;

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      setError(
        data.message ||
          "Login failed. Please check your credentials."
      );
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* =====================================================
          LEFT BRAND PANEL
      ===================================================== */}

      <section className="auth-side">

        <div className="auth-side-content">

          <Link
            to="/"
            className="text-white d-inline-flex align-items-center gap-2"
            style={{
              fontSize: "21px",
              fontWeight: "800",
            }}
          >
            <span
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "13px",
                background: "rgba(255,255,255,0.15)",
              }}
            >
              <HeartPulse size={23} />
            </span>

            SmartHealth
          </Link>

          <div
            style={{
              marginTop: "80px",
            }}
          >

            <div className="ai-badge">
              AI-POWERED HEALTHCARE
            </div>

            <h1>
              Your health.
              <br />
              Smarter decisions.
            </h1>

            <p>
              SmartHealth combines modern healthcare
              technology with machine learning to provide
              educational health-risk screening and help
              you better understand your health information.
            </p>


            {/* FEATURES */}

            <div className="auth-feature">

              <div className="auth-feature-icon">
                <Brain size={19} />
              </div>

              <div>
                <strong>
                  AI-assisted screening
                </strong>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.72,
                  }}
                >
                  Intelligent health-risk assessment
                </div>
              </div>

            </div>


            <div className="auth-feature">

              <div className="auth-feature-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>
                  Secure patient account
                </strong>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.72,
                  }}
                >
                  Protected authentication and access
                </div>
              </div>

            </div>


            <div className="auth-feature">

              <div className="auth-feature-icon">
                <Activity size={19} />
              </div>

              <div>
                <strong>
                  Personal health history
                </strong>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.72,
                  }}
                >
                  Keep track of your AI assessments
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          LOGIN PANEL
      ===================================================== */}

      <section className="auth-panel">

        <div className="auth-box">

          {/* MOBILE / SECOND LOGO */}

          <Link
            to="/"
            className="auth-logo text-decoration-none text-dark"
          >
            <span
              className="brand-mark"
              style={{
                width: "38px",
                height: "38px",
              }}
            >
              <HeartPulse size={20} />
            </span>

            SmartHealth
          </Link>


          {/* HEADER */}

          <div className="mb-4">

            <h2>
              Welcome back
            </h2>

            <p className="auth-description mb-0">
              Sign in to continue to your health dashboard.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div
              className="alert alert-danger d-flex align-items-start gap-2"
              style={{
                borderRadius: "12px",
                fontSize: "13px",
                border: "none",
              }}
            >

              <span>
                ⚠️
              </span>

              <span>
                {error}
              </span>

            </div>

          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="mb-3">

              <label
                htmlFor="email"
                className="form-label-modern"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="auth-input"
                autoComplete="email"
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}

            <div className="mb-2">

              <div className="d-flex justify-content-between">

                <label
                  htmlFor="password"
                  className="form-label-modern"
                >
                  Password
                </label>

              </div>

              <div
                style={{
                  position: "relative",
                }}
              >

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="auth-input"
                  autoComplete="current-password"
                  disabled={loading}
                  style={{
                    paddingRight: "48px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "9px",
              }}
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />

                  Signing in...
                </>
              ) : (
                <>
                  Sign in

                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </form>


          {/* SECURITY */}

          <div
            className="d-flex align-items-center justify-content-center gap-2 mt-4"
            style={{
              color: "#64748b",
              fontSize: "11px",
            }}
          >
            <CheckCircle2
              size={14}
              color="#16a34a"
            />

            Secure JWT-based authentication
          </div>


          {/* REGISTER */}

          <div
            className="text-center mt-4"
            style={{
              fontSize: "14px",
              color: "#64748b",
            }}
          >

            Don't have an account?{" "}

            <Link
              to="/register"
              className="fw-bold text-primary"
            >
              Create account
            </Link>

          </div>


          {/* DISCLAIMER */}

          <div
            className="mt-4 text-center"
            style={{
              fontSize: "10px",
              lineHeight: "1.6",
              color: "#94a3b8",
            }}
          >
            SmartHealth is an educational health-screening
            application. AI results are not a medical
            diagnosis and should not replace professional
            medical advice.
          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;