interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div style={{ marginBottom: "30px" }}>
      <div
        style={{
          height: "10px",
          background: "#e2e8f0",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "10px",
            background: "#2563eb",
            borderRadius: "10px",
            transition: "0.3s",
          }}
        />
      </div>

      <p style={{ marginTop: "10px" }}>
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}

export default ProgressBar;
