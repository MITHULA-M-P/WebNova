import type { PlannerData } from "../../types/planner";

interface Props {
  data: PlannerData;
  updateField: (field: keyof PlannerData, value: any) => void;
}

const featureList = [
  "Contact Form",
  "WhatsApp Chat",
  "Online Booking",
  "Blog",
  "Payment Gateway",
  "Gallery",
];

function StepThree({ data, updateField }: Props) {
  const toggleFeature = (feature: string) => {
    const updated = data.features.includes(feature)
      ? data.features.filter((f) => f !== feature)
      : [...data.features, feature];

    updateField("features", updated);
  };

  return (
    <div className="step">

      <h2>Select Features</h2>

      <div className="checkbox-group">

        {featureList.map((feature) => (
          <label key={feature}>

            <input
              type="checkbox"
              checked={data.features.includes(feature)}
              onChange={() => toggleFeature(feature)}
            />

            {feature}

          </label>
        ))}

      </div>

    </div>
  );
}

export default StepThree;