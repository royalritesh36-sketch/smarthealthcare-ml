import { Link } from "react-router-dom";
import {
  HeartPulse,
  Brain,
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  Clock3,
  LockKeyhole,
  Stethoscope,
} from "lucide-react";

function Home() {
  return (
    <div className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">

        <div className="container">

          <div className="row align-items-center min-vh-75 py-5">

            {/* LEFT */}

            <div className="col-lg-6">

              <div className="hero-badge mb-4">
                <Sparkles size={14} />
                AI-POWERED HEALTHCARE
              </div>

              <h1 className="hero-title">
                Smarter Healthcare.
                <br />

                <span>
                  Earlier Detection.
                </span>
              </h1>

              <p className="hero-description">
                Understand your potential health risks with
                AI-assisted screening powered by machine learning.
                SmartHealth helps you make more informed decisions
                about your health.
              </p>


              {/* BUTTONS */}

              <div className="d-flex flex-wrap gap-3 mt-4">

                <Link
                  to="/register"
                  className="hero-primary-btn"
                >
                  Start Health Assessment

                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#features"
                  className="hero-secondary-btn"
                >
                  Explore Features
                </a>

              </div>


              {/* TRUST STATS */}

              <div className="hero-trust-row mt-5">

                <div className="hero-trust-item">

                  <div className="hero-trust-icon">
                    <Brain size={19} />
                  </div>

                  <div>
                    <strong>AI</strong>
                    <span>Powered Analysis</span>
                  </div>

                </div>


                <div className="hero-trust-item">

                  <div className="hero-trust-icon">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <strong>24/7</strong>
                    <span>Available</span>
                  </div>

                </div>


                <div className="hero-trust-item">

                  <div className="hero-trust-icon">
                    <LockKeyhole size={19} />
                  </div>

                  <div>
                    <strong>Secure</strong>
                    <span>Health Data</span>
                  </div>

                </div>

              </div>

            </div>


            {/* RIGHT — HEALTH CARD */}

            <div className="col-lg-6 mt-5 mt-lg-0">

              <div className="hero-visual">

                {/* Decorative circles */}

                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>


                <div className="health-dashboard-card">

                  {/* CARD HEADER */}

                  <div className="health-card-header">

                    <div className="health-card-icon">
                      <HeartPulse size={25} />
                    </div>

                    <div>

                      <span>
                        AI HEALTH SCREENING
                      </span>

                      <h3>
                        Health Risk Assessment
                      </h3>

                    </div>

                  </div>


                  <p className="health-card-description">
                    AI-assisted early health-risk screening
                    based on selected health parameters.
                  </p>


                  {/* HEART HEALTH */}

                  <div className="health-risk-row">

                    <div className="health-risk-title">

                      <span>
                        Heart Health
                      </span>

                      <strong className="risk-low">
                        Low Risk
                      </strong>

                    </div>

                    <div className="health-progress">

                      <div
                        className="health-progress-fill health-progress-low"
                        style={{ width: "25%" }}
                      ></div>

                    </div>

                    <small>
                      Lower potential risk
                    </small>

                  </div>


                  {/* DIABETES */}

                  <div className="health-risk-row">

                    <div className="health-risk-title">

                      <span>
                        Diabetes Risk
                      </span>

                      <strong className="risk-moderate">
                        Moderate
                      </strong>

                    </div>

                    <div className="health-progress">

                      <div
                        className="health-progress-fill health-progress-moderate"
                        style={{ width: "55%" }}
                      ></div>

                    </div>

                    <small>
                      Requires attention
                    </small>

                  </div>


                  {/* CARD FOOTER */}

                  <div className="health-card-footer">

                    <div>
                      <ShieldCheck size={17} />
                      Secure screening
                    </div>

                    <div>
                      <Activity size={17} />
                      AI assisted
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="features-section"
      >

        <div className="container">

          <div className="section-heading">

            <div className="section-label">
              FEATURES
            </div>

            <h2>
              Intelligent Healthcare Assistance
            </h2>

            <p>
              Technology designed to support early health
              screening and help you understand your health.
            </p>

          </div>


          <div className="row g-4">

            {/* FEATURE 1 */}

            <div className="col-md-4">

              <div className="feature-card">

                <div className="feature-icon feature-icon-blue">
                  <Brain size={24} />
                </div>

                <div className="feature-number">
                  01
                </div>

                <h4>
                  AI Risk Prediction
                </h4>

                <p>
                  Analyze health parameters using a machine
                  learning model to estimate potential heart
                  disease risk.
                </p>

                <Link
                  to="/register"
                  className="feature-link"
                >
                  Explore screening
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="col-md-4">

              <div className="feature-card">

                <div className="feature-icon feature-icon-purple">
                  <Activity size={24} />
                </div>

                <div className="feature-number">
                  02
                </div>

                <h4>
                  Health Dashboard
                </h4>

                <p>
                  Monitor your assessments, review prediction
                  history, and keep important health information
                  organized in one place.
                </p>

                <Link
                  to="/login"
                  className="feature-link"
                >
                  View dashboard
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="col-md-4">

              <div className="feature-card">

                <div className="feature-icon feature-icon-green">
                  <ShieldCheck size={24} />
                </div>

                <div className="feature-number">
                  03
                </div>

                <h4>
                  Secure Data
                </h4>

                <p>
                  Your account is protected through secure
                  authentication and a structured application
                  architecture.
                </p>

                <Link
                  to="/register"
                  className="feature-link"
                >
                  Create account
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="how-section">

        <div className="container">

          <div className="section-heading">

            <div className="section-label">
              HOW IT WORKS
            </div>

            <h2>
              Your health journey in three steps
            </h2>

            <p>
              Simple, guided and designed for early screening.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-md-4">

              <div className="step-card">

                <div className="step-number">
                  01
                </div>

                <Stethoscope size={25} />

                <h4>
                  Enter your information
                </h4>

                <p>
                  Provide basic health and medical parameters
                  through our guided assessment form.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="step-card">

                <div className="step-number">
                  02
                </div>

                <Brain size={25} />

                <h4>
                  AI analyzes your data
                </h4>

                <p>
                  Our machine-learning service processes the
                  selected health parameters.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="step-card">

                <div className="step-number">
                  03
                </div>

                <HeartPulse size={25} />

                <h4>
                  Understand your result
                </h4>

                <p>
                  Review your estimated risk level and keep
                  your assessment available in your history.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="about-section"
      >

        <div className="container">

          <div className="about-card">

            <div className="about-content">

              <div className="section-label">
                ABOUT SMARTHEALTH
              </div>

              <h2>
                Technology designed to support
                better health awareness.
              </h2>

              <p>
                SmartHealth is an AI-based healthcare screening
                platform developed to help users understand
                potential health risks through machine-learning
                analysis.
              </p>

              <p>
                It combines a modern web application with
                secure authentication, MongoDB data storage,
                ASP.NET Core APIs and a Python machine-learning
                service.
              </p>

              <Link
                to="/register"
                className="hero-primary-btn"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

            </div>


            <div className="about-visual">

              <div className="about-icon-large">
                <HeartPulse size={55} />
              </div>

              <div className="about-mini-card">

                <ShieldCheck size={19} />

                <div>
                  <strong>
                    Secure Architecture
                  </strong>

                  <span>
                    Built for protected access
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

      <section className="disclaimer-section">

        <div className="container">

          <div className="disclaimer-card">

            <ShieldCheck size={20} />

            <div>

              <strong>
                Important health information
              </strong>

              <p>
                SmartHealth provides AI-assisted educational
                and early-screening information only. Results
                are not a medical diagnosis and should not
                replace advice from a qualified healthcare
                professional.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="smart-footer">

        <div className="container">

          <div className="footer-main">

            <div>

              <div className="footer-brand">

                <span className="footer-logo">
                  <HeartPulse size={19} />
                </span>

                SmartHealth

              </div>

              <p>
                AI-based smart healthcare screening platform.
              </p>

            </div>


            <div className="footer-links">

              <Link to="/">
                Home
              </Link>

              <a href="#features">
                Features
              </a>

              <a href="#about">
                About
              </a>

              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>

            </div>

          </div>


          <div className="footer-bottom">

            <span>
              © 2026 SmartHealth. Final Year Project.
            </span>

            <span>
              AI-assisted healthcare screening
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;