import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  History as HistoryIcon,
  HeartPulse,
  CalendarDays,
  Activity,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // LOAD PREDICTION HISTORY
  // ==========================================

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      // Get JWT token
      const token = localStorage.getItem("token");

      // No token = login required
      if (!token) {
        navigate("/login");
        return;
      }


      // Call backend
      const response = await api.get(
        "/Prediction/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(
        "Prediction History Response:",
        response.data
      );


      /*
        IMPORTANT

        Your working backend returns:

        {
          success: true,
          predictions: [...]
        }

        Therefore we use:

        response.data.predictions
      */

      setHistory(
        response.data.predictions || []
      );

    } catch (err) {

      console.error(
        "Prediction History Error:",
        err
      );


      // ======================================
      // JWT EXPIRED / INVALID
      // ======================================

      if (err.response?.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }


      // ======================================
      // OTHER ERROR
      // ======================================

      setError(
        err.response?.data?.message ||
        "Unable to load your prediction history."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD HISTORY WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    loadHistory();

  }, []);


  // ==========================================
  // RISK BADGE CLASS
  // ==========================================

  const getRiskClass = (riskLevel) => {

    const level =
      riskLevel?.toLowerCase() || "";


    if (level.includes("high")) {

      return "history-risk high";

    }


    if (level.includes("moderate")) {

      return "history-risk moderate";

    }


    return "history-risk low";
  };


  // ==========================================
  // RISK ICON CLASS
  // ==========================================

  const getRiskIconClass = (riskLevel) => {

    const level =
      riskLevel?.toLowerCase() || "";


    if (level.includes("high")) {

      return "history-icon high";

    }


    if (level.includes("moderate")) {

      return "history-icon moderate";

    }


    return "history-icon low";
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Date unavailable";
    }


    const parsedDate = new Date(date);


    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }


    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ==========================================
  // FORMAT DATE ONLY
  // ==========================================

  const formatDateOnly = (date) => {

    if (!date) {
      return "—";
    }


    const parsedDate = new Date(date);


    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }


    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // FORMAT RISK PERCENTAGE
  // ==========================================

  const formatRiskPercentage = (value) => {

    const number = Number(value);


    if (Number.isNaN(number)) {
      return "0.0%";
    }


    return `${number.toFixed(1)}%`;
  };


  return (
    <div className="history-page">


      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <div className="history-topbar">

        <div className="container history-topbar-inner">


          {/* Dashboard */}

          <Link
            to="/dashboard"
            className="history-back"
          >

            <ArrowLeft size={16} />

            Dashboard

          </Link>


          {/* Brand */}

          <div className="history-brand">

            <div className="history-brand-icon">

              <HeartPulse size={18} />

            </div>

            <span>
              SmartHealth
            </span>

          </div>


          {/* Security */}

          <div className="history-secure">

            <ShieldCheck size={14} />

            Secure Records

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="container history-container">


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="history-header">


          <div className="history-heading">


            {/* Icon */}

            <div className="history-title-icon">

              <HistoryIcon size={25} />

            </div>


            {/* Heading */}

            <div>

              <span className="history-eyebrow">

                HEALTH RECORDS

              </span>


              <h1>

                Prediction History

              </h1>


              <p>

                Review your previous AI-assisted
                health assessments and screening
                results.

              </p>

            </div>

          </div>


          {/* Refresh */}

          <button
            className="history-refresh"
            onClick={loadHistory}
            disabled={loading}
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? "spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="history-overview">


          {/* TOTAL ASSESSMENTS */}

          <div className="history-overview-item">

            <div className="history-overview-icon blue">

              <Activity size={18} />

            </div>


            <div>

              <span>

                TOTAL ASSESSMENTS

              </span>


              <strong>

                {history.length}

              </strong>

            </div>

          </div>


          {/* LATEST RISK */}

          <div className="history-overview-item">

            <div className="history-overview-icon red">

              <HeartPulse size={18} />

            </div>


            <div>

              <span>

                LATEST RISK

              </span>


              <strong>

                {history.length > 0
                  ? history[0].riskLevel
                  : "—"}

              </strong>

            </div>

          </div>


          {/* LAST SCREENING */}

          <div className="history-overview-item">

            <div className="history-overview-icon purple">

              <CalendarDays size={18} />

            </div>


            <div>

              <span>

                LAST SCREENING

              </span>


              <strong>

                {history.length > 0
                  ? formatDateOnly(
                      history[0].createdAt
                    )
                  : "—"}

              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="history-error">

            <span>

              ⚠️

            </span>


            <span>

              {error}

            </span>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="history-state">

            <div className="history-state-icon loading">

              <Activity size={26} />

            </div>


            <h3>

              Loading your records

            </h3>


            <p>

              Securely retrieving your health
              assessments...

            </p>

          </div>

        )}


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading &&
          !error &&
          history.length === 0 && (

            <div className="history-state">


              <div className="history-state-icon">

                <HeartPulse size={28} />

              </div>


              <h3>

                No assessments yet

              </h3>


              <p>

                Complete your first AI health
                assessment and your result will
                appear here.

              </p>


              <Link
                to="/prediction"
                className="history-primary-btn"
              >

                Start Assessment

                <ArrowRight size={16} />

              </Link>

            </div>

          )}


        {/* =================================================
            HISTORY RECORDS
        ================================================= */}

        {!loading &&
          !error &&
          history.length > 0 && (

            <div className="history-section">


              {/* Section heading */}

              <div className="history-section-title">

                <div>

                  <h2>

                    Your Assessments

                  </h2>


                  <p>

                    Most recent assessments
                    appear first.

                  </p>

                </div>


                <span>

                  {history.length}

                  {" "}

                  record
                  {history.length !== 1
                    ? "s"
                    : ""}

                </span>

              </div>


              {/* Records */}

              <div className="history-list">


                {history.map(
                  (item, index) => (

                    <div
                      className="history-record"
                      key={
                        item.id ||
                        `${item.createdAt}-${index}`
                      }
                    >


                      {/* =================================
                          RECORD ICON
                      ================================= */}

                      <div
                        className={
                          getRiskIconClass(
                            item.riskLevel
                          )
                        }
                      >

                        <HeartPulse
                          size={20}
                        />

                      </div>


                      {/* =================================
                          RECORD CONTENT
                      ================================= */}

                      <div className="history-record-content">


                        {/* RECORD HEADER */}

                        <div className="history-record-header">


                          <div>

                            <span className="history-record-label">

                              {index === 0
                                ? "LATEST ASSESSMENT"
                                : "HEART HEALTH ASSESSMENT"}

                            </span>


                            <h3>

                              Heart Disease Risk
                              Screening

                            </h3>

                          </div>


                          {/* Risk badge */}

                          <div
                            className={
                              getRiskClass(
                                item.riskLevel
                              )
                            }
                          >

                            <span className="risk-dot"></span>

                            {item.riskLevel}

                          </div>

                        </div>


                        {/* =================================
                            RECORD META
                        ================================= */}

                        <div className="history-record-meta">


                          {/* Date */}

                          <div>

                            <CalendarDays
                              size={14}
                            />

                            {formatDate(
                              item.createdAt
                            )}

                          </div>


                          {/* Risk score */}

                          <div>

                            <Activity
                              size={14}
                            />

                            Risk Score


                            <strong>

                              {formatRiskPercentage(
                                item.riskPercentage
                              )}

                            </strong>

                          </div>

                        </div>


                        {/* =================================
                            AI MESSAGE
                        ================================= */}

                        <div className="history-record-message">

                          <span>

                            AI ASSESSMENT

                          </span>


                          <p>

                            {item.message ||
                              "Assessment completed successfully."}

                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


        {/* =================================================
            BOTTOM ACTION
        ================================================= */}

        {!loading &&
          history.length > 0 && (

            <div className="history-bottom-action">


              <div>

                <h3>

                  Want to check again?

                </h3>


                <p>

                  Start another AI-assisted
                  health screening.

                </p>

              </div>


              <Link
                to="/prediction"
                className="history-primary-btn"
              >

                New Assessment

                <ArrowRight size={16} />

              </Link>

            </div>

          )}


        {/* =================================================
            DISCLAIMER
        ================================================= */}

        <div className="history-disclaimer">

          <ShieldCheck size={16} />


          <p>

            SmartHealth provides AI-assisted
            educational and early-screening
            information only. Results are not a
            medical diagnosis and should not replace
            professional medical advice.

          </p>

        </div>

      </main>

    </div>
  );
}

export default History;