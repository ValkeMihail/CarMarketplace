import React from 'react';

type FormInputProps = {
  label: string;
  name: string;
  maxLength?: number;
  defaultValue?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  placeholder?: string;
  max?: number;
};

export const FormInputText: React.FC<FormInputProps> = ({
  label,
  name,
  maxLength,
  defaultValue,
  onChange,
  id,
  placeholder,
}) => {
  return (
    <div className="form-input">
      <label>{label}:</label>
      <input
        name={name}
        maxLength={maxLength}
        defaultValue={defaultValue}
        onChange={onChange}
        id={id}
        type={"text"}
        placeholder={placeholder}
      />
    </div>
  );
};
