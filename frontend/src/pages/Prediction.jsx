import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HeartPulse,
  ArrowLeft,
  ArrowRight,
  Activity,
  Stethoscope,
  Droplets,
  Brain,
  ShieldCheck,
  Loader2,
  RotateCcw,
} from "lucide-react";

import api from "../services/api";

function Prediction() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleReset = () => {
    setFormData({
      age: "",
      sex: "",
      cp: "",
      trestbps: "",
      chol: "",
      fbs: "",
      restecg: "",
      thalach: "",
      exang: "",
      oldpeak: "",
      slope: "",
      ca: "",
      thal: "",
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const requiredFields = Object.entries(formData);

    const missingField = requiredFields.find(
      ([, value]) => value === ""
    );

    if (missingField) {
      setError(
        "Please complete all health assessment fields before continuing."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        age: Number(formData.age),
        sex: Number(formData.sex),
        cp: Number(formData.cp),
        trestbps: Number(formData.trestbps),
        chol: Number(formData.chol),
        fbs: Number(formData.fbs),
        restecg: Number(formData.restecg),
        thalach: Number(formData.thalach),
        exang: Number(formData.exang),
        oldpeak: Number(formData.oldpeak),
        slope: Number(formData.slope),
        ca: Number(formData.ca),
        thal: Number(formData.thal),
      };

      const response = await api.post(
        "/Prediction",
        payload
      );

      if (response.data?.success) {
        navigate("/prediction-result", {
          state: {
            result: response.data.prediction,
          },
        });
      } else {
        setError(
          response.data?.message ||
            "Unable to generate prediction."
        );
      }
    } catch (err) {
      console.error("Prediction error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else {
        setError(
          "Unable to connect to the prediction service. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-page">

      {/* HEADER */}

      <div className="assessment-topbar">

        <div className="container">

          <div className="d-flex align-items-center justify-content-between">

            <Link
              to="/dashboard"
              className="assessment-back"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>

            <div className="assessment-brand">
              <span>
                <HeartPulse size={19} />
              </span>

              SmartHealth
            </div>

            <div className="assessment-security">
              <ShieldCheck size={16} />
              Secure Assessment
            </div>

          </div>

        </div>

      </div>


      {/* MAIN */}

      <main className="container py-5">

        {/* INTRO */}

        <div className="assessment-heading">

          <div className="assessment-label">
            <Brain size={15} />
            AI HEALTH SCREENING
          </div>

          <h1>
            Understand your heart health risk
          </h1>

          <p>
            Provide your health information below. Our
            machine-learning system will analyze these
            parameters and estimate your potential heart
            disease risk.
          </p>

        </div>


        {/* WARNING */}

        <div className="assessment-notice">

          <ShieldCheck size={20} />

          <div>
            <strong>
              Educational screening only
            </strong>

            <p>
              This assessment provides an AI-generated
              risk estimate for educational and early
              screening purposes. It is not a medical
              diagnosis.
            </p>
          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="assessment-error">
            ⚠️ {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* =================================================
              SECTION 1
          ================================================= */}

          <section className="assessment-section">

            <div className="assessment-section-header">

              <div className="assessment-section-icon blue">
                <Stethoscope size={21} />
              </div>

              <div>
                <h3>Basic Information</h3>

                <p>
                  Tell us about your basic health profile.
                </p>
              </div>

            </div>


            <div className="row g-4">

              {/* AGE */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  placeholder="Enter your age"
                  className="assessment-input"
                />

                <small>
                  Age in years
                </small>

              </div>


              {/* SEX */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Biological sex
                </label>

                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="1">
                    Male
                  </option>

                  <option value="0">
                    Female
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* =================================================
              SECTION 2
          ================================================= */}

          <section className="assessment-section">

            <div className="assessment-section-header">

              <div className="assessment-section-icon red">
                <HeartPulse size={21} />
              </div>

              <div>
                <h3>Heart Symptoms</h3>

                <p>
                  Select the option that best describes
                  your current condition.
                </p>
              </div>

            </div>


            <div className="row g-4">

              {/* CHEST PAIN */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Chest pain type
                </label>

                <select
                  name="cp"
                  value={formData.cp}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select chest pain type
                  </option>

                  <option value="0">
                    Typical angina
                  </option>

                  <option value="1">
                    Atypical angina
                  </option>

                  <option value="2">
                    Non-anginal pain
                  </option>

                  <option value="3">
                    No chest pain
                  </option>
                </select>

              </div>


              {/* EXERCISE ANGINA */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Exercise-related chest discomfort
                </label>

                <select
                  name="exang"
                  value={formData.exang}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="0">
                    No
                  </option>

                  <option value="1">
                    Yes
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* =================================================
              SECTION 3
          ================================================= */}

          <section className="assessment-section">

            <div className="assessment-section-header">

              <div className="assessment-section-icon purple">
                <Droplets size={21} />
              </div>

              <div>
                <h3>Blood & Cholesterol</h3>

                <p>
                  Enter your latest available measurements.
                </p>
              </div>

            </div>


            <div className="row g-4">

              {/* BLOOD PRESSURE */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Resting blood pressure
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    name="trestbps"
                    value={formData.trestbps}
                    onChange={handleChange}
                    min="70"
                    max="250"
                    placeholder="e.g. 120"
                    className="assessment-input"
                  />

                  <span>
                    mmHg
                  </span>

                </div>

              </div>


              {/* CHOLESTEROL */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Serum cholesterol
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    name="chol"
                    value={formData.chol}
                    onChange={handleChange}
                    min="100"
                    max="600"
                    placeholder="e.g. 200"
                    className="assessment-input"
                  />

                  <span>
                    mg/dL
                  </span>

                </div>

              </div>


              {/* FASTING BLOOD SUGAR */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Fasting blood sugar
                </label>

                <select
                  name="fbs"
                  value={formData.fbs}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="0">
                    Normal
                  </option>

                  <option value="1">
                    Above 120 mg/dL
                  </option>
                </select>

              </div>


              {/* REST ECG */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Resting ECG result
                </label>

                <select
                  name="restecg"
                  value={formData.restecg}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="0">
                    Normal
                  </option>

                  <option value="1">
                    ST-T wave abnormality
                  </option>

                  <option value="2">
                    Left ventricular hypertrophy
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* =================================================
              SECTION 4
          ================================================= */}

          <section className="assessment-section">

            <div className="assessment-section-header">

              <div className="assessment-section-icon green">
                <Activity size={21} />
              </div>

              <div>
                <h3>Exercise & Heart Performance</h3>

                <p>
                  Provide your exercise-related measurements.
                </p>
              </div>

            </div>


            <div className="row g-4">

              {/* MAX HEART RATE */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Maximum heart rate achieved
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    name="thalach"
                    value={formData.thalach}
                    onChange={handleChange}
                    min="50"
                    max="250"
                    placeholder="e.g. 150"
                    className="assessment-input"
                  />

                  <span>
                    bpm
                  </span>

                </div>

              </div>


              {/* OLDPEAK */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  ST depression
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    step="0.1"
                    name="oldpeak"
                    value={formData.oldpeak}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    placeholder="e.g. 1.2"
                    className="assessment-input"
                  />

                  <span>
                    value
                  </span>

                </div>

              </div>


              {/* SLOPE */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  ST segment slope
                </label>

                <select
                  name="slope"
                  value={formData.slope}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="0">
                    Upsloping
                  </option>

                  <option value="1">
                    Flat
                  </option>

                  <option value="2">
                    Downsloping
                  </option>
                </select>

              </div>


              {/* THAL */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Thalassemia result
                </label>

                <select
                  name="thal"
                  value={formData.thal}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="1">
                    Normal
                  </option>

                  <option value="2">
                    Fixed defect
                  </option>

                  <option value="3">
                    Reversible defect
                  </option>
                </select>

              </div>


              {/* CA */}

              <div className="col-md-6">

                <label className="assessment-label-text">
                  Major vessels detected
                </label>

                <select
                  name="ca"
                  value={formData.ca}
                  onChange={handleChange}
                  className="assessment-input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="0">
                    0 vessels
                  </option>

                  <option value="1">
                    1 vessel
                  </option>

                  <option value="2">
                    2 vessels
                  </option>

                  <option value="3">
                    3 vessels
                  </option>

                </select>

              </div>

            </div>

          </section>


          {/* ACTIONS */}

          <div className="assessment-actions">

            <button
              type="button"
              onClick={handleReset}
              className="assessment-reset"
              disabled={loading}
            >
              <RotateCcw size={16} />
              Reset
            </button>


            <button
              type="submit"
              className="assessment-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />

                  Analyzing health data...
                </>
              ) : (
                <>
                  Analyze My Risk
                  <ArrowRight size={18} />
                </>
              )}

            </button>

          </div>

        </form>


        {/* FOOTNOTE */}

        <div className="assessment-footer-note">

          <ShieldCheck size={16} />

          <span>
            Your information is transmitted securely to
            the SmartHealth application for screening.
          </span>

        </div>

      </main>

    </div>
  );
}

export default Prediction;