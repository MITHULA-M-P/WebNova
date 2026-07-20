import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/Planner.css";

import ProgressBar from "./ProgressBar";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

import type { PlannerData } from "../../types/planner";
import { createPlan } from "../../services/api";

function Planner() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state as Partial<PlannerData> | undefined;

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [plannerData, setPlannerData] = useState<PlannerData>({
    websiteType: initialState?.websiteType || "",
    pages: initialState?.pages || 5,
    features: initialState?.features || [],
    budget: initialState?.budget || 10000,

    businessGoal: "",
    businessName: "",

    brandColor: "",
    hasLogo: false,

    email: "",
    phone: "",
  });

  const updateField = (
    field: keyof PlannerData,
    value: PlannerData[keyof PlannerData]
  ) => {
    setPlannerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields on step 4
    if (!plannerData.businessName || !plannerData.email || !plannerData.phone) {
      setSubmitError("Please fill in all contact details.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await createPlan(plannerData);
      console.log("Plan created successfully:", response);
      // Navigate to Blueprint with the saved database record state
      navigate("/blueprint", {
        state: response,
      });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to submit website plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="planner-section">
      <div className="planner-container">
        <h1>Plan My Website</h1>

        <p className="planner-subtitle">
          Answer a few simple questions and we'll generate your website blueprint.
        </p>

        <ProgressBar
          currentStep={currentStep}
          totalSteps={4}
        />

        {submitError && (
          <div className="submit-error" style={{ color: "#ef4444", marginBottom: "20px", fontWeight: "600", fontSize: "14px", textAlign: "center" }}>
            ⚠️ {submitError}
          </div>
        )}

        {currentStep === 1 && (
          <StepOne
            data={plannerData}
            updateField={updateField}
          />
        )}

        {currentStep === 2 && (
          <StepTwo
            data={plannerData}
            updateField={updateField}
          />
        )}

        {currentStep === 3 && (
          <StepThree
            data={plannerData}
            updateField={updateField}
          />
        )}

        {currentStep === 4 && (
          <StepFour
            data={plannerData}
            updateField={updateField}
          />
        )}

        <div className="planner-buttons">
          <button
            className="secondary-btn"
            onClick={previousStep}
            disabled={currentStep === 1 || submitting}
          >
            Back
          </button>

          {currentStep < 4 ? (
            <button
              className="primary-btn"
              onClick={nextStep}
            >
              Next
            </button>
          ) : (
            <button
              className="primary-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Saving Plan..." : "Generate Blueprint"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Planner;