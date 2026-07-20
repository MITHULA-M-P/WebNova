import type { PlannerData } from "../../types/planner";

interface Props {
  data: PlannerData;
  updateField: (field: keyof PlannerData, value: any) => void;
}

function StepOne({ data, updateField }: Props) {
  return (
    <div className="step">

      <h2>Select Website Type</h2>

      <select
        value={data.websiteType}
        onChange={(e) =>
          updateField("websiteType", e.target.value)
        }
      >
        <option value="">Choose</option>
        <option>Business</option>
        <option>Restaurant</option>
        <option>Portfolio</option>
        <option>E-Commerce</option>
      </select>

      <label>Number of Pages</label>

      <input
        type="number"
        min={1}
        value={data.pages}
        onChange={(e) =>
          updateField("pages", Number(e.target.value))
        }
      />

    </div>
  );
}

export default StepOne;