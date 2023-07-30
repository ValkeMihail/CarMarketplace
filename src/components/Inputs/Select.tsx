// <div className="selectSell">
//                 <label>Fuel Type:</label>
//                 <select  name="fuelType"  id="selectFuelType"  onChange={handleFuelSelectChange}  defaultValue={    isSellPage ? "Select Fuel Type" : carDefault?.fuelType  }>
//                   <option value="">Select Fuel Type</option>
//                   <option value="gasoline">Gasoline</option>
//                   <option value="diesel">Diesel</option>
//                   <option value="electric">Electric</option>
//                   <option value="hybrid">Hybrid</option>
//                 </select>
//               </div>

type SelectProps = {
  classType: string;
  label: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  defaultValue?: string | number;
  children?: React.ReactNode;
};

export const Select: React.FC<SelectProps> = ({
  classType,
  label,
  name,
  onChange,
  id,
  defaultValue,
  children,
}) => {
  return (
    <div className={classType}>
      <label>{label}:</label>
      <select
        name={name}
        onChange={onChange}
        id={id}
        defaultValue={defaultValue}
      >
        {children}
      </select>
    </div>
  );
};
