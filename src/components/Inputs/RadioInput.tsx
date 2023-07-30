import React from 'react';

type RadioInputProps = {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSellPage: boolean;
  id: string;
  name: string;
  checked?: boolean; 
};

const RadioInput: React.FC<RadioInputProps> = ({
  handleInputChange,
  isSellPage,
  id,
  name,
  checked = false,
}) => {
  return isSellPage ? (
    <input
      onChange={handleInputChange}
      type="radio"
      id={id}
      value={id}
      name={name}
    />
  ) : (
    <input
      onChange={handleInputChange}
      type="radio"
      id={id}
      value={id}
      name={name}
      checked={checked}
    />
  );
};

export default RadioInput;
