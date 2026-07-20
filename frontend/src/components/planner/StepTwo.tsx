import type { PlannerData } from "../../types/planner";

interface Props {
  data: PlannerData;
  updateField: (field: keyof PlannerData, value: any) => void;
}

function StepTwo({ data, updateField }: Props) {
  return (
    <div className="step">

      <h2>Business Goal</h2>

      <select
        value={data.businessGoal}
        onChange={(e) =>
          updateField("businessGoal", e.target.value)
        }
      >
        <option value="">Choose Goal</option>

        <option>Generate Leads</option>

        <option>Sell Products</option>

        <option>Showcase Portfolio</option>

        <option>Accept Bookings</option>
      </select>

      <label>Estimated Budget (₹)</label>

      <input
        type="number"
        value={data.budget}
        onChange={(e) =>
          updateField("budget", Number(e.target.value))
        }
      />

    </div>
  );
}

export default StepTwo;