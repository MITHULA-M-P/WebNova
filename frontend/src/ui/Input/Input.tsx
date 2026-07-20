import "./Input.css";

interface InputProps {
  label?: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "color" | "password";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  min?: number;
  max?: number;
}

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  rows?: number;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  name?: string;
  id?: string;
}

export function Input({ label, type = "text", value, onChange, placeholder, required, name, id, min, max }: InputProps) {
  return (
    <div className="form-group">
      {label && <label className="form-label" htmlFor={id || name}>{label}</label>}
      <input
        className="form-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        id={id || name}
        min={min}
        max={max}
      />
    </div>
  );
}

export function Textarea({ label, value, onChange, placeholder, required, name, id, rows = 4 }: TextareaProps) {
  return (
    <div className="form-group">
      {label && <label className="form-label" htmlFor={id || name}>{label}</label>}
      <textarea
        className="form-input form-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        id={id || name}
        rows={rows}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options, required, name, id }: SelectProps) {
  return (
    <div className="form-group">
      {label && <label className="form-label" htmlFor={id || name}>{label}</label>}
      <select
        className="form-input form-select"
        value={value}
        onChange={onChange}
        required={required}
        name={name}
        id={id || name}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default Input;
