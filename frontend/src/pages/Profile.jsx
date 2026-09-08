import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const loadProfileData = async () => {
      try {
        const response = await api.get("/Prediction/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPredictions(response.data.predictions || []);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalAssessments = predictions.length;

  const latestPrediction =
    predictions.length > 0 ? predictions[0] : null;

  const getInitials = () => {
    if (!user?.name) return "P";

    return user.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRiskClass = (risk) => {
    if (risk === "Low Risk") {
      return "profile-risk-low";
    }

    if (risk === "Moderate Risk") {
      return "profile-risk-moderate";
    }

    return "profile-risk-high";
  };

  return (
    <div className="profile-page">

      {/* Top Header */}
      <div className="profile-topbar">
        <div className="profile-topbar-inner">

          <button
            className="profile-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="profile-brand">
            <div className="profile-brand-icon">
              ❤️
            </div>

            <span>SmartHealth</span>
          </div>

          <div className="profile-secure">
            <span>🛡️</span>
            Secure Profile
          </div>

        </div>
      </div>

      {/* Main */}
      <main className="profile-container">

        {/* Page Heading */}
        <div className="profile-heading">

          <div>
            <span className="profile-eyebrow">
              ACCOUNT
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your SmartHealth account and view your
              health screening summary.
            </p>
          </div>

          <button
            className="profile-new-btn"
            onClick={() => navigate("/prediction")}
          >
            + New Assessment
          </button>

        </div>

        {/* Profile Hero */}
        <section className="profile-hero">

          <div className="profile-avatar">
            {getInitials()}
          </div>

          <div className="profile-main-info">

            <h2>
              {user?.name || "Patient"}
            </h2>

            <p>
              {user?.email || "No email available"}
            </p>

            <div className="profile-tags">

              <span className="profile-tag">
                👤 Patient
              </span>

              <span className="profile-tag profile-tag-active">
                ● Active Account
              </span>

            </div>

          </div>

          <div className="profile-account-status">

            <span>
              ACCOUNT STATUS
            </span>

            <strong>
              ✓ Verified
            </strong>

          </div>

        </section>

        {/* Statistics */}
        <section className="profile-stats">

          <div className="profile-stat-card">

            <div className="profile-stat-icon blue">
              📋
            </div>

            <div>
              <span>
                Total Assessments
              </span>

              <strong>
                {loading ? "..." : totalAssessments}
              </strong>
            </div>

          </div>

          <div className="profile-stat-card">

            <div className="profile-stat-icon red">
              ❤️
            </div>

            <div>
              <span>
                Latest Risk
              </span>

              <strong>
                {loading
                  ? "..."
                  : latestPrediction?.riskPercentage != null
                  ? `${latestPrediction.riskPercentage}%`
                  : "—"}
              </strong>
            </div>

          </div>

          <div className="profile-stat-card">

            <div className="profile-stat-icon green">
              🛡️
            </div>

            <div>
              <span>
                Screening Status
              </span>

              <strong className="text-success">
                Active
              </strong>
            </div>

          </div>

        </section>

        {/* Two Column Section */}
        <section className="profile-grid">

          {/* Personal Information */}
          <div className="profile-card">

            <div className="profile-card-header">

              <div>
                <span className="profile-card-icon">
                  👤
                </span>
              </div>

              <div>
                <h3>
                  Personal Information
                </h3>

                <p>
                  Your account information
                </p>
              </div>

            </div>

            <div className="profile-info-list">

              <div className="profile-info-row">

                <span>
                  Full Name
                </span>

                <strong>
                  {user?.name || "Patient"}
                </strong>

              </div>

              <div className="profile-info-row">

                <span>
                  Email Address
                </span>

                <strong>
                  {user?.email || "Not available"}
                </strong>

              </div>

              <div className="profile-info-row">

                <span>
                  Account Role
                </span>

                <strong>
                  {user?.role || "Patient"}
                </strong>

              </div>

              <div className="profile-info-row">

                <span>
                  Account Type
                </span>

                <strong>
                  Standard Patient
                </strong>

              </div>

            </div>

          </div>

          {/* Health Summary */}
          <div className="profile-card">

            <div className="profile-card-header">

              <div>
                <span className="profile-card-icon health">
                  ❤️
                </span>
              </div>

              <div>
                <h3>
                  Health Screening
                </h3>

                <p>
                  Latest AI-assisted assessment
                </p>
              </div>

            </div>

            {latestPrediction ? (
              <div className="profile-health-summary">

                <div className="profile-risk-box">

                  <span>
                    Latest Result
                  </span>

                  <strong
                    className={getRiskClass(
                      latestPrediction.riskLevel
                    )}
                  >
                    {latestPrediction.riskLevel}
                  </strong>

                </div>

                <div className="profile-risk-percentage">

                  <strong>
                    {latestPrediction.riskPercentage}%
                  </strong>

                  <span>
                    Estimated Risk
                  </span>

                </div>

                <p className="profile-health-message">
                  {latestPrediction.message}
                </p>

                <button
                  className="profile-history-btn"
                  onClick={() => navigate("/history")}
                >
                  View Full History →
                </button>

              </div>
            ) : (
              <div className="profile-no-health">

                <div>
                  🩺
                </div>

                <h4>
                  No assessment yet
                </h4>

                <p>
                  Complete your first AI health assessment
                  to see your screening summary here.
                </p>

                <button
                  onClick={() => navigate("/prediction")}
                >
                  Start Assessment →
                </button>

              </div>
            )}

          </div>

        </section>

        {/* Quick Actions */}
        <section className="profile-card profile-actions-card">

          <div className="profile-card-header">

            <div>
              <span className="profile-card-icon">
                ⚡
              </span>
            </div>

            <div>
              <h3>
                Quick Actions
              </h3>

              <p>
                Manage your SmartHealth activity
              </p>
            </div>

          </div>

          <div className="profile-actions">

            <button
              onClick={() => navigate("/prediction")}
              className="profile-action"
            >
              <span>🩺</span>

              <div>
                <strong>
                  New Assessment
                </strong>

                <small>
                  Check your current health risk
                </small>
              </div>

              <b>
                →
              </b>
            </button>

            <button
              onClick={() => navigate("/history")}
              className="profile-action"
            >
              <span>📊</span>

              <div>
                <strong>
                  Prediction History
                </strong>

                <small>
                  View all previous assessments
                </small>
              </div>

              <b>
                →
              </b>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="profile-action"
            >
              <span>🏠</span>

              <div>
                <strong>
                  Health Dashboard
                </strong>

                <small>
                  Return to your health overview
                </small>
              </div>

              <b>
                →
              </b>
            </button>

          </div>

        </section>

        {/* Security Notice */}
        <div className="profile-security">

          <div className="profile-security-icon">
            🛡️
          </div>

          <div>
            <strong>
              Your information is protected
            </strong>

            <p>
              SmartHealth uses secure authentication and
              protected application APIs to handle your account
              information.
            </p>
          </div>

        </div>

        {/* Logout */}
        <div className="profile-logout-section">

          <button
            className="profile-logout"
            onClick={handleLogout}
          >
            ↪ Logout from SmartHealth
          </button>

        </div>

        {/* Disclaimer */}
        <div className="profile-disclaimer">

          <strong>
            Important:
          </strong>{" "}
          SmartHealth provides AI-assisted educational and
          early-screening information only. Results are not a
          medical diagnosis and should not replace professional
          medical advice.

        </div>

      </main>

    </div>
  );
}

export default Profile;