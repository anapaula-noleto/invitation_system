'use client';

interface FormCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export function FormCheckbox({
  id,
  checked,
  onChange,
  label,
  description,
  className,
}: FormCheckboxProps) {
  return (
    <div className={`form-group ${className || ''}`}>
      <label className="form-checkbox-label">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="form-checkbox"
        />
        <span className="form-checkbox-text">
          {label}
        </span>
      </label>
      {description && (
        <p className="form-checkbox-description">{description}</p>
      )}
    </div>
  );
}
