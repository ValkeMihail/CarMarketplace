import React from "react";


interface NumericInputProps {
    max?: number;
    id?: string;
    placeholder?: string;
    maxLength?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Name?  : string;
    defaultValueNr?: string| number | undefined;
    
}
/**
 * This component is used to display a numeric input field.
 */
export const NumericInput: React.FC<NumericInputProps> = ({ max, id, placeholder ,maxLength , onChange,Name,defaultValueNr}) => {



    /**
     *  This function is used to format the number in the input field.
     * @param e  The event that is triggered when the user types in the input field.
     */
    const formatNumber = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        let value = target.value.replaceAll(/\D/g, "");
        if (max && Number(value) > max) {
          value = max.toString();
        }
        value = new Intl.NumberFormat("fr-FR").format(Number(value));
        target.value = value;
    };
      

  return (
        <input
            maxLength={maxLength}
            max={max}
            className="numericInput"
            inputMode="numeric"
            id={id}
            defaultValue={defaultValueNr}
            onInput={formatNumber}
            onChange={onChange}
            name={Name}
            type="text"
            placeholder={placeholder}
        />
  );
};
