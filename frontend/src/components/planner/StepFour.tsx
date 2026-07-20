import type { PlannerData } from "../../types/planner";

interface Props {
  data: PlannerData;
  updateField: (field: keyof PlannerData, value: any) => void;
}

function StepFour({ data, updateField }: Props) {
  return (
    <div className="step">

      <h2>Contact Details</h2>

      <label>Business Name</label>

      <input
        type="text"
        value={data.businessName}
        onChange={(e) =>
          updateField("businessName", e.target.value)
        }
      />

      <label>Email</label>

      <input
        type="email"
        value={data.email}
        onChange={(e) =>
          updateField("email", e.target.value)
        }
      />

      <label>Phone Number</label>

      <input
        type="tel"
        value={data.phone}
        onChange={(e) =>
          updateField("phone", e.target.value)
        }
      />

    </div>
  );
}

export default StepFour;