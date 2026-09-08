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
  UserRound,
} from "lucide-react";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/Auth/register",
        {
          name,
          email,
          password: formData.password,
        }
      );

      const data = response.data;

      if (data.success) {
        setSuccess(
          "Account created successfully. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 1200);

        return;
      }

      setError(
        data.message ||
          "Registration failed. Please try again."
      );
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError(
          "This email is already registered."
        );
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
          LEFT PANEL
      ===================================================== */}

      <section className="auth-side">

        <div className="auth-side-content">

          <Link
            to="/"
            className="text-white d-inline-flex align-items-center gap-2 text-decoration-none"
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
              START YOUR HEALTH JOURNEY
            </div>

            <h1>
              Healthcare
              <br />
              meets intelligence.
            </h1>

            <p>
              Create your SmartHealth account and access
              AI-assisted health screening, prediction
              history, and your personalized health dashboard.
            </p>


            {/* FEATURE 1 */}

            <div className="auth-feature">

              <div className="auth-feature-icon">
                <UserRound size={19} />
              </div>

              <div>
                <strong>
                  Personalized dashboard
                </strong>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.72,
                  }}
                >
                  Your health information in one place
                </div>
              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="auth-feature">

              <div className="auth-feature-icon">
                <Brain size={19} />
              </div>

              <div>
                <strong>
                  AI-assisted assessments
                </strong>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.72,
                  }}
                >
                  Machine-learning based screening
                </div>
              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="auth-feature">

              <div className="auth-feature-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>
                  Secure authentication
                </strong>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.72,
                  }}
                >
                  Protected account access
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          REGISTER PANEL
      ===================================================== */}

      <section className="auth-panel">

        <div className="auth-box">

          {/* LOGO */}

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
              Create your account
            </h2>

            <p className="auth-description mb-0">
              Join SmartHealth and start your personalized
              health screening journey.
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


          {/* SUCCESS */}

          {success && (

            <div
              className="alert alert-success d-flex align-items-start gap-2"
              style={{
                borderRadius: "12px",
                fontSize: "13px",
                border: "none",
              }}
            >

              <CheckCircle2
                size={17}
                className="flex-shrink-0"
              />

              <span>
                {success}
              </span>

            </div>

          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="mb-3">

              <label
                htmlFor="name"
                className="form-label-modern"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="auth-input"
                autoComplete="name"
                disabled={loading}
              />

            </div>


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

            <div className="mb-3">

              <label
                htmlFor="password"
                className="form-label-modern"
              >
                Password
              </label>

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
                  placeholder="Minimum 6 characters"
                  className="auth-input"
                  autoComplete="new-password"
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
                    transform:
                      "translateY(-50%)",
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


            {/* CONFIRM PASSWORD */}

            <div className="mb-2">

              <label
                htmlFor="confirmPassword"
                className="form-label-modern"
              >
                Confirm password
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="auth-input"
                  autoComplete="new-password"
                  disabled={loading}
                  style={{
                    paddingRight: "48px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
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
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* PASSWORD NOTE */}

            <div
              className="d-flex align-items-center gap-2 mt-2 mb-3"
              style={{
                fontSize: "11px",
                color: "#64748b",
              }}
            >
              <ShieldCheck size={14} />

              Your password is securely hashed before
              being stored.
            </div>


            {/* SUBMIT */}

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

                  Creating account...
                </>
              ) : (
                <>
                  Create account

                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </form>


          {/* LOGIN */}

          <div
            className="text-center mt-4"
            style={{
              fontSize: "14px",
              color: "#64748b",
            }}
          >

            Already have an account?{" "}

            <Link
              to="/login"
              className="fw-bold text-primary"
            >
              Sign in
            </Link>

          </div>


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

            Secure patient account creation

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

export default Register;