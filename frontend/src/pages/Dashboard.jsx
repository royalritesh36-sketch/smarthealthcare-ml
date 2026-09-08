import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Brain,
  ClipboardList,
  HeartPulse,
  History,
  LogOut,
  UserRound,
  ArrowRight,
  ShieldCheck,
  Droplets,
} from "lucide-react";

import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get(
          "/Prediction/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPredictions(
          response.data.predictions || []
        );
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const latestPrediction =
    predictions.length > 0
      ? predictions[0]
      : null;

  const getRiskClass = (riskLevel) => {
    if (riskLevel === "Low Risk") {
      return "risk-badge risk-low";
    }

    if (riskLevel === "Moderate Risk") {
      return "risk-badge risk-moderate";
    }

    return "risk-badge risk-high";
  };

  return (
    <div className="dashboard-shell">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="smart-navbar">

        <div className="container-fluid px-4">

          <div className="d-flex align-items-center justify-content-between h-100">

            <Link
              to="/dashboard"
              className="brand"
            >
              <span className="brand-mark">
                <HeartPulse size={21} />
              </span>

              SmartHealth
            </Link>

            <div className="d-flex align-items-center gap-3">

              <div className="d-none d-md-block text-end">

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  {user?.name || "Patient"}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  Patient Account
                </div>

              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                <LogOut size={14} className="me-1" />
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <h1 className="dashboard-title">
              Good to see you,{" "}
              {user?.name?.split(" ")[0] || "Patient"} 👋
            </h1>

            <p className="dashboard-subtitle">
              Monitor your health and use AI-assisted
              screening tools to understand your risk.
            </p>

          </div>

          <Link
            to="/prediction"
            className="btn-primary-modern"
          >
            <Activity
              size={17}
              className="me-2"
            />

            New Assessment
          </Link>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="stat-grid">

          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon">
                <HeartPulse size={22} />
              </div>

              {latestPrediction && (
                <span
                  className={getRiskClass(
                    latestPrediction.riskLevel
                  )}
                >
                  {latestPrediction.riskLevel}
                </span>
              )}

            </div>

            <div className="stat-label">
              Latest Heart Risk
            </div>

            <div className="stat-value">

              {loading
                ? "..."
                : latestPrediction
                ? `${latestPrediction.riskPercentage}%`
                : "Not assessed"}

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon">
                <ClipboardList size={22} />
              </div>

              <ShieldCheck
                size={19}
                color="#16a34a"
              />

            </div>

            <div className="stat-label">
              Total Assessments
            </div>

            <div className="stat-value">
              {loading
                ? "..."
                : predictions.length}
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-top">

              <div className="stat-icon">
                <Brain size={22} />
              </div>

            </div>

            <div className="stat-label">
              AI Screening
            </div>

            <div className="stat-value">
              Active
            </div>

          </div>

        </div>


        {/* =================================================
            AI + QUICK ACTIONS
        ================================================= */}

        <div className="ai-grid">

          <div className="ai-card">

            <span className="ai-badge">
              AI HEALTH SCREENING
            </span>

            <h2>
              Understand your heart health risk.
            </h2>

            <p>
              Provide basic health information and our
              machine-learning system will estimate your
              potential heart disease risk.
            </p>

            <Link
              to="/prediction"
              className="btn btn-light fw-semibold px-4 mt-2"
            >
              Start Assessment

              <ArrowRight
                size={17}
                className="ms-2"
              />
            </Link>

            <div className="ai-visual">
              <Brain size={52} />
            </div>

          </div>


          <div className="quick-card">

            <h5>
              Quick Actions
            </h5>

            <Link
              to="/prediction"
              className="quick-action-modern"
            >
              <span className="quick-action-icon">
                <Activity size={18} />
              </span>

              <span>
                New Health Assessment
              </span>
            </Link>

            <Link
              to="/history"
              className="quick-action-modern"
            >
              <span className="quick-action-icon">
                <History size={18} />
              </span>

              <span>
                Prediction History
              </span>
            </Link>

            <Link
              to="/profile"
              className="quick-action-modern"
            >
              <span className="quick-action-icon">
                <UserRound size={18} />
              </span>

              <span>
                My Profile
              </span>
            </Link>

          </div>

        </div>


        {/* =================================================
            RECENT PREDICTIONS
        ================================================= */}

        <div className="section-heading">

          <h3>
            Recent Predictions
          </h3>

          <Link
            to="/history"
            className="text-primary fw-semibold"
            style={{ fontSize: "14px" }}
          >
            View All
          </Link>

        </div>


        {loading ? (

          <div className="prediction-card text-center py-5">

            <div className="spinner-border text-primary" />

            <p className="text-secondary mt-3 mb-0">
              Loading your health data...
            </p>

          </div>

        ) : predictions.length === 0 ? (

          <div className="empty-state-modern">

            <div className="empty-state-icon">
              <Activity size={25} />
            </div>

            <h5 className="fw-bold">
              No assessments yet
            </h5>

            <p className="text-secondary">
              Complete your first AI health assessment
              to start building your health history.
            </p>

            <Link
              to="/prediction"
              className="btn-primary-modern d-inline-flex align-items-center"
            >
              Start Assessment

              <ArrowRight
                size={16}
                className="ms-2"
              />
            </Link>

          </div>

        ) : (

          <div className="prediction-card">

            {predictions
              .slice(0, 3)
              .map((item) => (

                <div
                  className="prediction-row"
                  key={item.id}
                >

                  <div className="d-flex align-items-center gap-3">

                    <div className="stat-icon">
                      <HeartPulse size={18} />
                    </div>

                    <div>

                      <div
                        className="fw-semibold"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        Heart Risk Assessment
                      </div>

                      <div
                        className="text-secondary"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </div>

                    </div>

                  </div>


                  <div className="d-flex align-items-center gap-3">

                    <strong>
                      {item.riskPercentage}%
                    </strong>

                    <span
                      className={getRiskClass(
                        item.riskLevel
                      )}
                    >
                      {item.riskLevel}
                    </span>

                  </div>

                </div>

              ))}

          </div>

        )}


        {/* =================================================
            DISCLAIMER
        ================================================= */}

        <div
          className="mt-4 p-3 rounded-3"
          style={{
            background: "#eff6ff",
            border: "1px solid #dbeafe",
          }}
        >

          <div className="d-flex gap-2">

            <ShieldCheck
              size={19}
              color="#2563eb"
              className="flex-shrink-0"
            />

            <div
              style={{
                fontSize: "12px",
                color: "#475569",
                lineHeight: "1.6",
              }}
            >
              <strong>Important:</strong> SmartHealth
              provides AI-assisted educational and
              early-screening information only. Results
              are not a medical diagnosis and should not
              replace professional medical advice.
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;