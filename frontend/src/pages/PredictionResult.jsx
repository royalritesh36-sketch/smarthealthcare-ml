import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Activity,
  CalendarDays,
  History,
  LayoutDashboard,
} from "lucide-react";

function PredictionResult() {
  const location = useLocation();

  const result = location.state?.result;

  if (!result) {
    return (
      <div className="result-page">
        <div className="container py-5">
          <div className="result-empty">
            <div className="result-empty-icon">
              🩺
            </div>

            <h2>No assessment result found</h2>

            <p>
              Please complete a health assessment first.
            </p>

            <Link
              to="/prediction"
              className="result-primary-btn"
            >
              Start Assessment
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const riskPercentage = Number(
    result.riskPercentage ?? 0
  );

  const riskLevel =
    result.riskLevel || "Low Risk";

  const message =
    result.message ||
    "Your assessment has been completed successfully.";

  const isHigh = riskLevel
    .toLowerCase()
    .includes("high");

  const isModerate = riskLevel
    .toLowerCase()
    .includes("moderate");

  const riskClass = isHigh
    ? "high"
    : isModerate
      ? "moderate"
      : "low";

  const getRiskDescription = () => {
    if (isHigh) {
      return "The assessment indicates a higher potential risk based on the health information provided.";
    }

    if (isModerate) {
      return "The assessment indicates some potential risk factors that may benefit from further evaluation.";
    }

    return "The assessment indicates a lower potential risk based on the health information provided.";
  };

  return (
    <div className="result-page">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="result-topbar">

        <div className="container">

          <div className="result-nav">

            <Link
              to="/dashboard"
              className="result-back"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>

            <div className="result-brand">

              <div className="result-brand-icon">
                <HeartPulse size={19} />
              </div>

              <span>
                SmartHealth
              </span>

            </div>

            <div className="result-secure">

              <ShieldCheck size={15} />

              Secure Result

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="container result-container">

        {/* SUCCESS HEADER */}

        <div className="result-success">

          <div className="result-success-icon">
            <CheckCircle2 size={27} />
          </div>

          <div>

            <span>
              ASSESSMENT COMPLETED
            </span>

            <h1>
              Your health screening result
            </h1>

            <p>
              Our AI-assisted system has analyzed the
              health information you provided.
            </p>

          </div>

        </div>


        {/* =================================================
            RESULT CARD
        ================================================= */}

        <section className={`result-main-card ${riskClass}`}>

          <div className="result-card-left">

            <div className="result-small-label">
              AI RISK ASSESSMENT
            </div>

            <h2>
              Potential Heart Disease Risk
            </h2>

            <p className="result-description">
              {getRiskDescription()}
            </p>


            {/* RISK BADGE */}

            <div className={`risk-badge ${riskClass}`}>

              <span className="risk-dot"></span>

              {riskLevel}

            </div>


            {/* MESSAGE */}

            <div className="result-message">

              <Activity size={18} />

              <span>
                {message}
              </span>

            </div>

          </div>


          {/* =================================================
              RISK CIRCLE
          ================================================= */}

          <div className="risk-circle-area">

            <div
              className={`risk-circle ${riskClass}`}
              style={{
                "--risk": `${Math.min(
                  riskPercentage,
                  100
                ) * 3.6}deg`,
              }}
            >

              <div className="risk-circle-inner">

                <span>
                  Risk Score
                </span>

                <strong>
                  {riskPercentage.toFixed(1)}%
                </strong>

              </div>

            </div>

            <small>
              AI-generated screening estimate
            </small>

          </div>

        </section>


        {/* =================================================
            INSIGHT CARDS
        ================================================= */}

        <div className="row g-4 mt-1">

          <div className="col-md-4">

            <div className="result-info-card">

              <div className="result-info-icon blue">
                <Activity size={20} />
              </div>

              <div>

                <span>
                  SCREENING STATUS
                </span>

                <h4>
                  Complete
                </h4>

                <p>
                  All required assessment parameters
                  were processed.
                </p>

              </div>

            </div>

          </div>


          <div className="col-md-4">

            <div className="result-info-card">

              <div className="result-info-icon green">
                <ShieldCheck size={20} />
              </div>

              <div>

                <span>
                  ANALYSIS METHOD
                </span>

                <h4>
                  AI Assisted
                </h4>

                <p>
                  Your information was analyzed by
                  the trained ML screening model.
                </p>

              </div>

            </div>

          </div>


          <div className="col-md-4">

            <div className="result-info-card">

              <div className="result-info-icon purple">
                <CalendarDays size={20} />
              </div>

              <div>

                <span>
                  ASSESSMENT DATE
                </span>

                <h4>
                  {new Date().toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </h4>

                <p>
                  Latest AI health screening.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            WHAT THIS MEANS
        ================================================= */}

        <section className="result-explanation">

          <div className="result-explanation-header">

            <div className="result-explanation-icon">
              💡
            </div>

            <div>

              <h3>
                What does this result mean?
              </h3>

              <p>
                Understanding your AI screening result
              </p>

            </div>

          </div>


          <div className="result-explanation-content">

            <p>
              The risk percentage is an estimate generated
              by the machine-learning model from the health
              parameters entered during this assessment.
            </p>

            <p>
              A lower score generally represents fewer
              patterns associated with heart disease in the
              model, while a higher score indicates that
              additional medical evaluation may be appropriate.
            </p>

            <div className="result-important">

              <ShieldCheck size={18} />

              <div>

                <strong>
                  Important
                </strong>

                <p>
                  This result is for educational and
                  early-screening purposes only. It does not
                  diagnose heart disease and should not replace
                  professional medical advice.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <section className="result-actions-section">

          <div>

            <h3>
              What would you like to do next?
            </h3>

            <p>
              Continue monitoring your health through
              SmartHealth.
            </p>

          </div>


          <div className="result-actions">

            <Link
              to="/dashboard"
              className="result-secondary-btn"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link
              to="/history"
              className="result-secondary-btn"
            >
              <History size={17} />
              View History
            </Link>

            <Link
              to="/prediction"
              className="result-primary-btn"
            >
              New Assessment
              <ArrowRight size={17} />
            </Link>

          </div>

        </section>


        {/* =================================================
            FOOTER DISCLAIMER
        ================================================= */}

        <div className="result-disclaimer">

          <ShieldCheck size={17} />

          <span>
            SmartHealth provides AI-assisted educational
            screening information only. Results are not a
            medical diagnosis and should not replace
            consultation with a qualified healthcare professional.
          </span>

        </div>

      </main>

    </div>
  );
}

export default PredictionResult;