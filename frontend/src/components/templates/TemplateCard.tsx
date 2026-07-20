import "./TemplateCard.css";
import {  type Template } from "../../data/templates";

interface Props {
  template: Template;
  onSelect: (template: Template) => void;
}

function TemplateCard({ template, onSelect }: Props) {
  return (
    <div className="template-card" onClick={() => onSelect(template)}>
      <div className="template-icon">{template.icon}</div>

      <h3>{template.name}</h3>

      <p>{template.description}</p>

      <button>View Details</button>
    </div>
  );
}

export default TemplateCard;